import React from "react"

export type FeedBackFormType = "feedback" | "add-resource" | "remove-resource" | "add-category"
export interface IFeedBackFormVariant {
  id: FeedBackFormType
  label: string
  description: string
  icon: React.ElementType
  color: string
  bg: string
  border: string
}
