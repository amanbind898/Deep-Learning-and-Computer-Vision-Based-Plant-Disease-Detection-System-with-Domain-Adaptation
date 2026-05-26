import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const decoded = getUserFromRequest(req)
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const total = await prisma.prediction.count({ where: { userId: decoded.userId } })
    const healthy = await prisma.prediction.count({ where: { userId: decoded.userId, isHealthy: true } })
    const diseased = total - healthy

    const avgResult = await prisma.prediction.aggregate({
      where: { userId: decoded.userId },
      _avg: { confidence: true },
    })

    const mostCommon = await prisma.prediction.groupBy({
      by: ['diseaseName'],
      where: { userId: decoded.userId, isHealthy: false },
      _count: { diseaseName: true },
      orderBy: { _count: { diseaseName: 'desc' } },
      take: 1,
    })

    return NextResponse.json({
      totalPredictions: total,
      healthyCount: healthy,
      diseasedCount: diseased,
      averageConfidence: Math.round((avgResult._avg.confidence || 0) * 100) / 100,
      mostCommonDisease: mostCommon[0]?.diseaseName || null,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
