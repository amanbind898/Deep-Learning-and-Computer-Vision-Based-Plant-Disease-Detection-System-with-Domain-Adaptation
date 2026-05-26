import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const decoded = getUserFromRequest(req)
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const prediction = await prisma.prediction.findUnique({ where: { id: params.id } })
    if (!prediction || prediction.userId !== decoded.userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.prediction.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Deleted' })
  } catch (error) {
    console.error('History delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
