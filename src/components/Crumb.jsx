import { Breadcrumb, BreadcrumbItem } from '@carbon/react'
import { Link } from 'react-router-dom'

export default function Crumb({ trail = [] }) {
  return (
    <Breadcrumb noTrailingSlash>
      {trail.map((t, i) => (
        <BreadcrumbItem key={i} isCurrentPage={t.isCurrentPage}>
          {t.to && !t.isCurrentPage ? <Link to={t.to}>{t.label}</Link> : t.label}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  )
}