import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const decoded = getUserFromRequest(req)
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const predictions = await prisma.prediction.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({
      predictions: predictions.map((p) => ({
        ...p,
        topPredictions: JSON.parse(p.topPredictions),
        recommendations: JSON.parse(p.recommendations),
      })),
      total: predictions.length,
    })
  } catch (error) {
    console.error('History GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const decoded = getUserFromRequest(req)
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const prediction = await prisma.prediction.create({
      data: {
        userId: decoded.userId,
        plantName: body.plantName,
        diseaseName: body.diseaseName,
        confidence: body.confidence,
        isHealthy: body.isHealthy,
        topPredictions: JSON.stringify(body.topPredictions || []),
        recommendations: JSON.stringify(body.recommendations || {}),
      },
    })

    return NextResponse.json({ message: 'Saved', id: prediction.id })
  } catch (error) {
    console.error('History POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const decoded = getUserFromRequest(req)
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await prisma.prediction.deleteMany({ where: { userId: decoded.userId } })
    return NextResponse.json({ message: 'All history cleared' })
  } catch (error) {
    console.error('History DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
