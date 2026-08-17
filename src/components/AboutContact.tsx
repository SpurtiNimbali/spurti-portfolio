import { isAboutTodo } from "../lib/parseAboutBody";

export type AboutContactLink = {
  label: string;
  href: string;
};

type Props = {
  links: AboutContactLink[];
};

function renderContactLink(link: AboutContactLink) {
  if (isAboutTodo(link.href) || link.href === "#") {
    return <span>{link.label}</span>;
  }

  const external = link.href.startsWith("http");
  return (
    <a
      href={link.href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {link.label}
    </a>
  );
}

export function AboutContact({ links }: Props) {
  return (
    <nav className="about-contact" aria-label="Contact">
      {links.map((link, i) => (
        <span key={`${link.label}-${i}`} className="about-contact__item">
          {i > 0 ? <span className="about-contact__sep" aria-hidden="true"> · </span> : null}
          {renderContactLink(link)}
        </span>
      ))}
    </nav>
  );
}
