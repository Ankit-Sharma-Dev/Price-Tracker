import Image from 'next/image'
import Link from 'next/link'

interface NavIcon {
  src: string
  alt: string
}

const navIcons: NavIcon[] = [
  { src: '/assets/icon.svg', alt: 'Search' },
  { src: '/assets/heart.svg', alt: 'Favorites' },
  { src: '/assets/user.svg', alt: 'Profile' },
]

const Navbar = () => {
  return (
    <header className="w-full">
      <nav className="nav">
        <Link href="/" className="flex items-center gap-1">
          <Image 
            src="/assets/logo.svg"
            width={27}
            height={27}
            alt="Price Tracker logo"
          />
          <p className="nav-logo">
            Price<span className="text-primary">Tracker</span>
          </p>
        </Link>

        <div className="flex items-center gap-5">
          {navIcons.map((icon) => (
            <Link key={icon.alt} href={`/${icon.alt.toLowerCase()}`} aria-label={icon.alt}>
              <Image 
                src={icon.src}
                alt={icon.alt}
                width={28}
                height={28}
                className="object-contain hover:opacity-75 transition-opacity duration-300"
              />
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}

export default Navbar

