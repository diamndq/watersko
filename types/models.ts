/**
 * WaterSKO Data Models
 * TypeScript interfaces for frontend state management
 * These align with the NestJS backend schema (to be implemented)
 */

export type UserRole = 'researcher' | 'activist' | 'guest'
export type WaterBodyStatus = 'clean' | 'at_risk' | 'polluted'
export type RiskLevel = 'low' | 'moderate' | 'high'
export type EcoActionType = 'cleanup' | 'inspection'
export type EcoActionStatus = 'planned' | 'in_progress' | 'completed'

export interface User {
  id: number
  email: string
  name: string
  role: UserRole
  createdAt: Date
}

export interface WaterBody {
  id: number
  name: string
  lat: number
  lng: number
  type: 'lake' | 'river' | 'reservoir'
  description: string
  status: WaterBodyStatus
  rating: number // 1-5
  reviewCount: number
}

export interface Measurement {
  id: number
  lakeId: number
  userId: number
  temperature: number // °C
  transparency: number // meters
  conductivity: number // μS/cm
  riskLevel: RiskLevel
  createdAt: Date
}

export interface Review {
  id: number
  lakeId: number
  userId: number
  userName: string
  rating: number // 1-5
  comment: string
  photos?: string[] // URLs (future: file uploads)
  createdAt: Date
}

export interface EcoAction {
  id: number
  lakeId: number
  userId: number
  actionType: EcoActionType
  status: EcoActionStatus
  date: Date
  participantsCount: number
  description: string
  createdAt: Date
}

/**
 * API Response Types (for type safety when consuming backend)
 */
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
