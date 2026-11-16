import logo from '@/assets/branding/torpor-logo.svg.asset.json';
export function ResearchLogo({ compact = false }: { compact?: boolean }) {
  return <img className={compact ? 'research-logo compact' : 'research-logo'} src={logo.url} alt="TORPOR — Space Biology Research" width={920} height={280}/>;
}