"use client"

import { useState } from "react"
import { Building2 } from "lucide-react"

interface CompanyLogoProps {
  company: string
  className?: string
  size?: number
}

export function CompanyLogo({ company, className = "", size = 24 }: CompanyLogoProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Extract domain from company name
  const getDomainFromCompany = (companyName: string): string => {
    const company = companyName.toLowerCase().trim()
    
    // Direct mappings for common companies
    const companyDomains: Record<string, string> = {
      'google': 'google.com',
      'meta': 'meta.com',
      'facebook': 'facebook.com',
      'amazon': 'amazon.com',
      'apple': 'apple.com',
      'microsoft': 'microsoft.com',
      'netflix': 'netflix.com',
      'spotify': 'spotify.com',
      'tesla': 'tesla.com',
      'uber': 'uber.com',
      'airbnb': 'airbnb.com',
      'stripe': 'stripe.com',
      'slack': 'slack.com',
      'linkedin': 'linkedin.com',
      'twitter': 'twitter.com',
      'openai': 'openai.com',
      'shopify': 'shopify.com',
      'oracle': 'oracle.com',
      'ibm': 'ibm.com',
      'salesforce': 'salesforce.com',
      'unity': 'unity.com',
      'snowflake': 'snowflake.com',
      'discord': 'discord.com',
      'adobe': 'adobe.com',
      'coinbase': 'coinbase.com',
      'atlassian': 'atlassian.com',
      'palantir': 'palantir.com',
      'figma': 'figma.com',
      'cloudflare': 'cloudflare.com',
      'anthropic': 'anthropic.com',
      'github': 'github.com',
      'zoom': 'zoom.us',
      'duckduckgo': 'duckduckgo.com',
      'boston dynamics': 'bostondynamics.com',
      'nvidia': 'nvidia.com',
      'cisco': 'cisco.com',
      'waymo': 'waymo.com',
      'rigetti computing': 'rigetti.com',
      'magic leap': 'magicleap.com',
      'datadog': 'datadoghq.com',
      'mongodb': 'mongodb.com',
    }

    // Check direct mappings first
    if (companyDomains[company]) {
      return companyDomains[company]
    }

    // If no direct mapping, try adding .com
    return `${company.replace(/\s+/g, '')}.com`
  }

  const domain = getDomainFromCompany(company)
  const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`

  const handleImageLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleImageError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  if (hasError) {
    return (
      <div 
        className={`inline-flex items-center justify-center bg-muted rounded ${className}`}
        style={{ width: size, height: size }}
      >
        <Building2 className="text-muted-foreground" size={size * 0.6} />
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      {isLoading && (
        <div 
          className="bg-muted rounded animate-pulse"
          style={{ width: size, height: size }}
        />
      )}
      <img
        src={logoUrl}
        alt={`${company} logo`}
        width={size}
        height={size}
        className={`rounded ${isLoading ? 'hidden' : 'block'}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ minWidth: size, minHeight: size }}
      />
    </div>
  )
}