from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from pydantic import BaseModel
from api.db import db
from api.auth import (
    Token,
    verify_password,
    get_password_hash,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from api.deps import get_current_user
from prisma.models import User

router = APIRouter()

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str

@router.post("/signup", response_model=dict)
async def signup(user_in: UserCreate):
    # Check if user exists
    user_exists = await db.user.find_unique(where={"email": user_in.email})
    if user_exists:
        raise HTTPException(
            status_code=400,
            detail="User with this email already exists"
        )
    
    # Hash password and create user
    hashed_password = get_password_hash(user_in.password)
    user = await db.user.create(
        data={
            "name": user_in.name,
            "email": user_in.email,
            "password": hashed_password
        }
    )
    
    # Create token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return {
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        },
        "token": access_token
    }

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login", response_model=dict)
async def login(req: LoginRequest):
    user = await db.user.find_unique(where={"email": req.email})
    if not user or not verify_password(req.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return {
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        },
        "token": access_token
    }

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email
    )
