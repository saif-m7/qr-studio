import {
  Link,
  Type,
  Phone,
  Mail,
  Wifi,
  Contact,
  MapPin,
  IndianRupee,
} from 'lucide-react'

export const QR_TYPES = [
  { key: 'url',      label: 'URL',      Icon: Link         },
  { key: 'text',     label: 'Text',     Icon: Type         },
  { key: 'wifi',     label: 'Wi-Fi',    Icon: Wifi         },
  { key: 'contact',  label: 'Contact',  Icon: Contact      },
  { key: 'email',    label: 'Email',    Icon: Mail         },
  { key: 'phone',    label: 'Phone',    Icon: Phone        },
  { key: 'location', label: 'Location', Icon: MapPin       },
  { key: 'upi',      label: 'UPI',      Icon: IndianRupee  },
]

/**
 * QRTypeSelector
 * Professional horizontal segmented utility navigation for QR types.
 *
 * @param {{ selectedType: string, onSelect: (type: string) => void }} props
 */
export function QRTypeSelector({ selectedType, onSelect }) {
  return (
    <nav
      aria-label="QR Type Selector"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        overflowX: 'auto',
        padding: '4px',
        background: 'var(--bg-subtle)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        scrollbarWidth: 'none',
      }}
    >
      {QR_TYPES.map(({ key, label, Icon }) => {
        const isActive = selectedType === key
        return (
          <button
            key={key}
            id={`qr-type-${key}`}
            onClick={() => onSelect(key)}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`${label} QR code`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              height: '32px',
              padding: '0 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid',
              borderColor: isActive ? 'var(--border)' : 'transparent',
              background: isActive ? 'var(--bg-panel)' : 'transparent',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontSize: '12.5px',
              fontWeight: isActive ? 600 : 500,
              fontFamily: 'var(--font-sans)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.12s ease',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = 'var(--text-primary)'
                e.currentTarget.style.background = 'var(--bg-hover)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = 'var(--text-secondary)'
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            <Icon
              size={14}
              style={{
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                transition: 'color 0.12s ease',
              }}
              aria-hidden="true"
            />
            <span>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
