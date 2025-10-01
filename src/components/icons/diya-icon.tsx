import * as React from "react"
import { SVGProps } from "react"

export const DiyaIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth={0}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="none" />
    <path d="M12 18c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm-3.5-5c0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5-3.5 1.57-3.5 3.5z" />
    <path d="M12 5.5c-1.25 0-2.4.29-3.44.82.31.48.54 1.03.66 1.62.29-1.03 1.3-1.74 2.45-1.74 1.48 0 2.65 1.25 2.65 2.78 0 .42-.1.82-.27 1.18.52.29 1.08.45 1.67.45 2.76 0 5-2.24 5-5s-2.24-5-5-5c-1.39 0-2.65.57-3.57 1.47C11.96 5.59 11.98 5.5 12 5.5z" />
  </svg>
)
