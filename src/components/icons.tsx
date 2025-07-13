import { type SVGProps } from "react"

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 12l2 2 4-4" />
      <path d="M20.2 10.2c.8.8.8 2 0 2.8l-1.8 1.8c-.8.8-2 .8-2.8 0l-7.4-7.4c-.8-.8-.8-2 0-2.8l1.8-1.8c.8-.8 2-.8 2.8 0Z" />
      <path d="m5.9 15.9 4.2-4.2" />
    </svg>
  ),
}
