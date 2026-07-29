import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import {
    EnvelopeIcon,
    LinkedinLogoIcon,
    GithubLogoIcon,
    MapPinIcon,
    ArrowSquareOutIcon,
    CalendarIcon,
    TagIcon,
    ArrowRightIcon,
    TranslateIcon,
    TerminalIcon,
    CircleIcon,
} from '@phosphor-icons/react'
import { useLang } from '../../context/LangProvider'

// ─── Types ────────────────────────────────────────────────────────────────────

interface GitHubProfile {
    avatar_url: string
    name: string
    bio: string
    public_repos: number
    followers: number
    following: number
}

type Lang = 'pt' | 'en'

// ─── Level helpers ─────────────────────────────────────────────────────────────

function levelColor(level: number): string {
    if (level <= 4) return '#f59e0b'
    if (level === 5) return '#38bdf8'
    return '#34d399'
}

function levelLabel(level: number, legend: { range: string; label: string }[]): string {
    if (level <= 4) return legend[0].label
    if (level === 5) return legend[1].label
    return legend[2].label
}

function GreetingTyped({ lang }: { lang: Lang }) {
    const lines = lang === 'pt'
        ? ['Olá...', 'me chamo Lucas.', 'Seja bem-vindo.']
        : ['Hello...', "I'm Lucas.", 'Welcome.']

    const [lineIdx, setLineIdx] = useState(0)
    const [display, setDisplay] = useState('')
    const [phase, setPhase] = useState<'typing' | 'pause' | 'erasing'>('typing')

    useEffect(() => {
        const target = lines[lineIdx]
        let timeout: ReturnType<typeof setTimeout>

        if (phase === 'typing') {
            if (display.length < target.length) {
                timeout = setTimeout(() => setDisplay(target.slice(0, display.length + 1)), 60)
            } else {
                timeout = setTimeout(() => setPhase('pause'), lineIdx === lines.length - 1 ? 99999 : 1600)
            }
        } else if (phase === 'pause') {
            timeout = setTimeout(() => setPhase('erasing'), 300)
        } else {
            if (display.length > 0) {
                timeout = setTimeout(() => setDisplay(d => d.slice(0, -1)), 25)
            } else {
                setLineIdx(i => (i + 1) % lines.length)
                setPhase('typing')
            }
        }
        return () => clearTimeout(timeout)
    }, [display, phase, lineIdx, lines])

    return (
        <div style={{
            fontFamily: 'var(--mono)',
            fontSize: '15px',
            marginBottom: '12px',
            minHeight: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
        }}>
            <span style={{ color: 'var(--green)', opacity: 0.5 }}>›</span>
            <span style={{
                color: lineIdx === 0 ? 'var(--text-muted)' : lineIdx === 1 ? 'var(--text)' : 'var(--cyan)',
                fontWeight: lineIdx === 1 ? 600 : 400,
            }}>
                {display}
            </span>
            <span style={{
                display: 'inline-block',
                width: '7px', height: '15px',
                background: 'var(--green)',
                animation: 'cursor 1s step-end infinite',
                verticalAlign: 'middle',
                borderRadius: '1px',
            }} />
        </div>
    )
}

// ─── Skills ───────────────────────────────────────────────────────────────────

const SKILLS = {
    frontend: [
        { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', level: 5 },
        { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', level: 6 },
        { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', level: 6 },
        { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', level: 6 },
    ],
    backend: [
        { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', level: 7 },
        { name: 'NestJS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg', level: 7 },
        { name: 'TypeORM', icon: 'https://typeorm.io/img/typeorm-icon-colored.png', level: 6 },
        { name: 'Express.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', level: 5 },
        { name: 'OpenAI API', icon: null, level: 6 },
    ],
    database: [
        { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', level: 7 },
        { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', level: 5 },
        { name: 'Firebird', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebird/firebird-original.svg', level: 7 },
    ],
    tools: [
        { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', level: 8 },
        { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', level: 6 },
        { name: 'n8n', icon: 'https://devicons.railway.com/i/n8n.svg', level: 6 },
        { name: 'Easypanel', icon: null, level: 6 },
        { name: 'Grafana', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/grafana/grafana-original.svg', level: 3 },
        { name: 'Jest', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jest/jest-plain.svg', level: 4 },
        { name: 'Agile/Kanban', icon: null, level: 5 },
        { name: 'AWS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', level: 4 }
    ],
}

// ─── Translations ─────────────────────────────────────────────────────────────

const T = {
    pt: {
        openToWork: 'Disponível para oportunidades',
        roles: ['Desenvolvedor Back-End', 'Engenheiro de Software', 'Desenvolvedor Full-Stack'],
        location: 'Brasília, DF – Brasil',
        repos: 'Repositórios',
        followers: 'Seguidores',
        following: 'Seguindo',
        about: 'sobre',
        aboutText: 'Desenvolvedor Full-Stack com foco em back-end, especializado em NestJS, TypeORM e PostgreSQL. Experiência prática no desenvolvimento de APIs REST, automações com n8n e integrações com serviços externos como OpenAI e Evolution API. Trabalho com Docker, versionamento Git e deploy via Easypanel, monitorando ambientes com Grafana em ciclos ágeis com Kanban. Cursando Engenharia de Software, busco constantemente evoluir técnica e profissionalmente.',
        experience: 'experiência',
        projects: 'projetos',
        education: 'educação',
        skills: 'habilidades',
        blog: 'blog',
        present: 'atual',
        website: 'acessar',
        footer: '© {year} · Lucas G. Amorim Steffen',
        promptPrefix: '~/portfolio',
        experience_items: [
            {
                role: 'Desenvolvedor Back-end Jr',
                company: 'VF PAR',
                location: 'Brasília, DF – Brasil',
                description: 'Desenvolvimento e manutenção dos sistemas internos com NestJS, TypeORM e PostgreSQL no back-end, e React no front-end. Implementação de APIs REST, automações com n8n, integrações via Evolution API e Chatwoot para atendimento via WhatsApp. Deploy via Easypanel, monitoramento com Grafana e fluxo de trabalho orientado a Kanban.',
                current: true,
                tags: ['NestJS', 'PostgreSQL', 'React', 'n8n', 'Docker'],
            },
            {
                role: 'Analista de Q.A',
                company: 'TopSapp',
                location: 'Sinop, MT – Brasil',
                period: 'Dezembro 2025 – Março 2026',
                description: 'Execução de testes funcionais, de regressão e validação de fluxos críticos em sistemas web. Identificação e documentação de bugs, garantindo estabilidade e qualidade das entregas antes e após cada deploy.',
                current: false,
                tags: ['Testes', 'QA', 'Regressão'],
            },
            {
                role: 'Analista de Implantação de Sistemas',
                company: 'Ecocentauro',
                location: 'Sinop, MT – Brasil',
                period: 'Janeiro 2024 – Dezembro 2025',
                description: 'Criação de relatórios detalhados com Crystal Reports e FastReports, utilizando SQL para extração, tratamento e formatação de dados conforme requisitos de cada cliente. Apoio na implantação e configuração de sistemas.',
                current: false,
                tags: ['SQL', 'Crystal Reports', 'FastReports'],
            },
            {
                role: 'Assistente Administrativo',
                company: 'Autoescola Meridional',
                location: 'Sinop, MT – Brasil',
                period: 'Fevereiro 2023 – Janeiro 2024',
                description: 'Gestão de agendamentos de aulas teóricas e práticas, controle de documentação e montagem de processos para emissão de CNH.',
                current: false,
                tags: ['Gestão', 'Documentação'],
            },
        ],
        education_items: [
            {
                institution: 'Estácio',
                period: '2025 – 2029',
                degree: 'Bacharelado em Engenharia de Software (Em andamento)',
                detail: 'Previsão de conclusão: 2029 · 2º Semestre',
            },
        ],
        projects_items: [
            {
                title: 'Conversy',
                status: 'ao vivo',
                type: 'Gestão de SDRs',
                date: '2026',
                description: 'Plataforma completa para gestão de times de SDR, com controle de leads, acompanhamento de metas e visão gerencial em tempo real.',
                tags: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express.js', 'PostgreSQL'],
                url: 'https://conversy.up.railway.app/',
                statusColor: '#34d399',
            },
            {
                title: 'Portfólio Pessoal',
                status: 'ao vivo',
                type: 'Projeto pessoal',
                date: '2026',
                description: 'Portfólio com integração à API do GitHub, snake de contribuições animado e sistema de internacionalização PT/EN.',
                tags: ['React', 'TypeScript', 'Tailwind CSS', 'GitHub API'],
                url: '#',
                statusColor: '#34d399',
            },
        ],
        blog_items: [] as { title: string; excerpt: string; date: string }[],
        skillCategories: {
            all: 'todos',
            frontend: 'frontend',
            backend: 'backend',
            database: 'banco de dados',
            tools: 'ferramentas',
        },
        skillLegend: [
            { range: '1–4', label: 'Básico' },
            { range: '5', label: 'Conheço e utilizo' },
            { range: '6–10', label: 'Intermediário / Avançado' },
        ],
    },
    en: {
        openToWork: 'Open to opportunities',
        roles: ['Back-End Developer', 'Software Engineer', 'Full-Stack Developer'],
        location: 'Brasília, DF – Brazil',
        repos: 'Repos',
        followers: 'Followers',
        following: 'Following',
        about: 'about',
        aboutText: 'Full-Stack Developer focused on back-end, specialized in NestJS, TypeORM and PostgreSQL. Hands-on experience building REST APIs, automations with n8n and integrations with external services like OpenAI and Evolution API. I work with Docker, Git versioning and deployment via Easypanel, monitoring environments with Grafana in agile Kanban cycles. Currently pursuing a degree in Software Engineering, constantly seeking technical and professional growth.',
        experience: 'experience',
        projects: 'projects',
        education: 'education',
        skills: 'skills',
        blog: 'blog',
        present: 'current',
        website: 'visit',
        footer: '© {year} · Lucas G. Amorim Steffen',
        promptPrefix: '~/portfolio',
        experience_items: [
            {
                role: 'Junior Back-end Developer',
                company: 'VF PAR',
                location: 'Brasília, DF – Brazil',
                description: 'Development and maintenance of internal systems using NestJS, TypeORM and PostgreSQL on the back-end, and React on the front-end. REST API implementation, automations with n8n, integrations via Evolution API and Chatwoot for WhatsApp support. Deploy via Easypanel, monitoring with Grafana and Kanban-driven workflow.',
                current: true,
                tags: ['NestJS', 'PostgreSQL', 'React', 'n8n', 'Docker'],
            },
            {
                role: 'Q.A. Analyst',
                company: 'TopSapp',
                location: 'Sinop, MT – Brazil',
                period: 'December 2025 – March 2026',
                description: 'Executed functional, regression, and critical workflow testing across web systems. Identified and documented bugs, ensuring product stability and quality before and after each deployment.',
                current: false,
                tags: ['Testing', 'QA', 'Regression'],
            },
            {
                role: 'Systems Implementation Analyst',
                company: 'Ecocentauro',
                location: 'Sinop, MT – Brazil',
                period: 'January 2024 – December 2025',
                description: 'Built detailed reports using Crystal Reports and FastReports, leveraging SQL to extract, process, and format data per client requirements. Supported system deployment and configuration.',
                current: false,
                tags: ['SQL', 'Crystal Reports', 'FastReports'],
            },
            {
                role: 'Administrative Assistant',
                company: 'Autoescola Meridional',
                location: 'Sinop, MT – Brazil',
                period: 'February 2023 – January 2024',
                description: "Managed scheduling of theoretical and practical driving lessons, handled documentation, and assembled CNH (driver's license) application files in compliance with DETRAN requirements.",
                current: false,
                tags: ['Management', 'Documentation'],
            },
        ],
        education_items: [
            {
                institution: 'Estácio',
                period: '2025 – 2029',
                degree: "Bachelor's in Software Engineering (Ongoing)",
                detail: 'Expected graduation: 2029 · 2nd Semester',
            },
        ],
        projects_items: [
            {
                title: 'Conversy',
                status: 'live',
                type: 'SDR management',
                date: '2026',
                description: 'Complete platform for SDR team management, featuring lead tracking, goal monitoring and real-time management dashboards.',
                tags: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express.js', 'PostgreSQL'],
                url: 'https://conversy.up.railway.app/',
                statusColor: '#34d399',
            },
            {
                title: 'Personal Portfolio',
                status: 'live',
                type: 'Personal project',
                date: '2026',
                description: 'Portfolio with GitHub API integration, animated contribution snake and PT/EN internationalization system.',
                tags: ['React', 'TypeScript', 'Tailwind CSS', 'GitHub API'],
                url: '#',
                statusColor: '#34d399',
            },
        ],
        blog_items: [] as { title: string; excerpt: string; date: string }[],
        skillCategories: {
            all: 'all',
            frontend: 'frontend',
            backend: 'backend',
            database: 'database',
            tools: 'tools',
        },
        skillLegend: [
            { range: '1–4', label: 'Basic' },
            { range: '5', label: 'Know & use it' },
            { range: '6–10', label: 'Intermediate / Advanced' },
        ],
    },
}

const GITHUB_USERNAME = 'Lucas-Steffen'

const SOCIAL = (lang: Lang) => [
    { label: lang === 'pt' ? 'E-mail' : 'Email', icon: EnvelopeIcon, href: 'mailto:lucasgabriel.programador@gmail.com' },
    { label: 'LinkedIn', icon: LinkedinLogoIcon, href: 'https://linkedin.com/in/lucasteffen' },
    { label: 'GitHub', icon: GithubLogoIcon, href: `https://github.com/${GITHUB_USERNAME}` },
]

// ─── Grid Background ──────────────────────────────────────────────────────────

function GridBackground() {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
        }}>
            {/* Dot grid */}
            <div style={{
                position: 'absolute',
                inset: '-40px',
                backgroundImage: `radial-gradient(circle, rgba(52,211,153,0.18) 1px, transparent 1px)`,
                backgroundSize: '32px 32px',
                animation: 'grid-drift 20s linear infinite',
                opacity: 0.4,
            }} />
            {/* Radial fade overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 30%, var(--bg) 100%)',
            }} />
            {/* Bottom fade */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '300px',
                background: 'linear-gradient(to top, var(--bg), transparent)',
            }} />
        </div>
    )
}

// ─── Typing effect ────────────────────────────────────────────────────────────

function TypedRole({ roles }: { roles: string[] }) {
    const [display, setDisplay] = useState('')
    const [roleIdx, setRoleIdx] = useState(0)
    const [phase, setPhase] = useState<'typing' | 'pause' | 'erasing'>('typing')

    useEffect(() => {
        const target = roles[roleIdx]
        let timeout: ReturnType<typeof setTimeout>

        if (phase === 'typing') {
            if (display.length < target.length) {
                timeout = setTimeout(() => setDisplay(target.slice(0, display.length + 1)), 55)
            } else {
                timeout = setTimeout(() => setPhase('pause'), 2000)
            }
        } else if (phase === 'pause') {
            timeout = setTimeout(() => setPhase('erasing'), 400)
        } else {
            if (display.length > 0) {
                timeout = setTimeout(() => setDisplay(d => d.slice(0, -1)), 28)
            } else {
                setRoleIdx(i => (i + 1) % roles.length)
                setPhase('typing')
            }
        }
        return () => clearTimeout(timeout)
    }, [display, phase, roleIdx, roles])

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--mono)',
            fontSize: '15px',
            color: 'var(--text-muted)',
            marginBottom: '12px',
        }}>
            <span style={{ color: 'var(--green)', opacity: 0.6 }}>$</span>
            <span style={{ color: 'var(--cyan)' }}>whoami</span>
            <span style={{ color: 'var(--text-dim)', margin: '0 2px' }}>→</span>
            <span style={{ color: 'var(--text)' }}>{display}</span>
            <span style={{
                display: 'inline-block',
                width: '8px',
                height: '16px',
                background: 'var(--green)',
                animation: 'cursor 1s step-end infinite',
                verticalAlign: 'middle',
                borderRadius: '1px',
            }} />
        </div>
    )
}

// ─── Scroll Reveal ────────────────────────────────────────────────────────────

function RevealSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                el.style.transitionDelay = `${delay}ms`
                el.classList.add('visible')
                obs.disconnect()
            }
        }, { threshold: 0.1 })
        obs.observe(el)
        return () => obs.disconnect()
    }, [delay])
    return <div ref={ref} className="reveal">{children}</div>
}

// ─── Lang Toggle ──────────────────────────────────────────────────────────────

function LangToggle({ lang, onToggle }: { lang: Lang; onToggle: () => void }) {
    return (
        <button className="lang-toggle" onClick={onToggle}
            title={lang === 'pt' ? 'Switch to English' : 'Mudar para Português'}>
            <TranslateIcon size={13} />
            {lang === 'pt' ? 'EN' : 'PT'}
        </button>
    )
}

// ─── Section ──────────────────────────────────────────────────────────────────

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
    return (
        <section id={id} style={{ marginBottom: '80px' }}>
            <RevealSection>
                <div className="section-title">{title}</div>
            </RevealSection>
            {children}
        </section>
    )
}

// ─── GitHub Contribution Snake ────────────────────────────────────────────────

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
}

function formatDate(dateStr: string, lang: Lang): string {
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    })
}

interface ContributionDay { date: string; count: number; level: number }
interface TooltipState { visible: boolean; x: number; y: number; date: string; count: number }

function GitHubContributionSnake({ username, lang }: { username: string; lang: Lang }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const [stats, setStats] = useState<{ last30: number; lastYear: number } | null>(null)
    const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, date: '', count: 0 })
    const gridRef = useRef<number[][]>([])
    const dateGridRef = useRef<ContributionDay[][]>([])
    const pathIdxRef = useRef(0)
    const eatenRef = useRef<Set<string>>(new Set())
    const snakeRef = useRef<[number, number][]>([])
    const animRef = useRef(0)
    const lastStepRef = useRef(0)

    const WEEKS = 52, DAYS = 7, CELL = 10, GAP = 2
    const STEP = CELL + GAP
    const W = WEEKS * STEP - GAP
    const H = DAYS * STEP - GAP
    const SNAKE_LEN = 7, SPEED_MS = 55

    const path = useMemo<[number, number][]>(() => {
        const p: [number, number][] = []
        for (let row = 0; row < DAYS; row++)
            for (let i = 0; i < WEEKS; i++)
                p.push([row % 2 === 0 ? i : WEEKS - 1 - i, row])
        return p
    }, [])

    useEffect(() => {
        fetch(`https://github-contributions-api.jogruber.de/v4/${username}`)
            .then(r => r.json())
            .then(({ contributions }: { contributions: ContributionDay[] }) => {
                const now = new Date()
                const cutoff52w = new Date(now.getTime() - 52 * 7 * 24 * 60 * 60 * 1000)
                const cutoff365 = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
                const cutoff30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                const grid: number[][] = Array.from({ length: WEEKS }, () => Array(DAYS).fill(0))
                const dateGrid: ContributionDay[][] = Array.from({ length: WEEKS }, () =>
                    Array(DAYS).fill(null).map(() => ({ date: '', count: 0, level: 0 })))
                let last30 = 0, lastYear = 0
                contributions.forEach(c => {
                    const d = new Date(c.date + 'T12:00:00')
                    if (d >= cutoff52w) {
                        const diff = Math.floor((d.getTime() - cutoff52w.getTime()) / 86400000)
                        const col = Math.floor(diff / 7), row = diff % 7
                        if (col >= 0 && col < WEEKS) { grid[col][row] = c.level; dateGrid[col][row] = c }
                    }
                    if (d >= cutoff365) lastYear += c.count
                    if (d >= cutoff30) last30 += c.count
                })
                gridRef.current = grid; dateGridRef.current = dateGrid
                setStats({ last30, lastYear })
            }).catch(() => { })
    }, [username])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')!
        const LEVEL_COLORS = [
            'rgba(255,255,255,0.04)',
            'rgba(52,211,153,0.2)',
            'rgba(52,211,153,0.42)',
            'rgba(52,211,153,0.68)',
            'rgba(52,211,153,0.95)',
        ]
        snakeRef.current = [path[0]]; pathIdxRef.current = 0; eatenRef.current = new Set()

        const draw = (ts: number) => {
            if (ts - lastStepRef.current >= SPEED_MS) {
                lastStepRef.current = ts
                const nextIdx = (pathIdxRef.current + 1) % path.length
                pathIdxRef.current = nextIdx
                const head = path[nextIdx]
                snakeRef.current = [head, ...snakeRef.current.slice(0, SNAKE_LEN - 1)]
                eatenRef.current.add(`${head[0]},${head[1]}`)
                if (nextIdx === 0) eatenRef.current = new Set()
            }
            ctx.clearRect(0, 0, W, H)
            const grid = gridRef.current, snake = snakeRef.current, eaten = eatenRef.current
            const snakeMap = new Map<string, number>()
            snake.forEach(([c, r], i) => snakeMap.set(`${c},${r}`, i))

            for (let col = 0; col < WEEKS; col++) {
                for (let row = 0; row < DAYS; row++) {
                    const x = col * STEP, y = row * STEP, key = `${col},${row}`
                    const sIdx = snakeMap.get(key)
                    ctx.shadowBlur = 0
                    if (sIdx !== undefined) {
                        if (sIdx === 0) { ctx.shadowBlur = 10; ctx.shadowColor = '#34d399'; ctx.fillStyle = '#34d399' }
                        else { const t = 1 - sIdx / SNAKE_LEN; ctx.shadowBlur = 5 * t; ctx.shadowColor = `rgba(52,211,153,${t})`; ctx.fillStyle = `rgba(52,211,153,${t * 0.9 + 0.1})` }
                    } else if (eaten.has(key)) {
                        ctx.fillStyle = 'rgba(255,255,255,0.02)'
                    } else {
                        ctx.fillStyle = LEVEL_COLORS[Math.min(grid[col]?.[row] ?? 0, 4)]
                    }
                    roundRect(ctx, x, y, CELL, CELL, 2); ctx.fill(); ctx.shadowBlur = 0
                }
            }
            animRef.current = requestAnimationFrame(draw)
        }
        animRef.current = requestAnimationFrame(draw)
        return () => cancelAnimationFrame(animRef.current)
    }, [H, STEP, W, path])

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current; if (!canvas) return
        const rect = canvas.getBoundingClientRect()
        const mx = (e.clientX - rect.left) * (W / rect.width)
        const my = (e.clientY - rect.top) * (H / rect.height)
        const col = Math.floor(mx / STEP), row = Math.floor(my / STEP)
        const insideCell = mx >= col * STEP && mx <= col * STEP + CELL && my >= row * STEP && my <= row * STEP + CELL
        if (col >= 0 && col < WEEKS && row >= 0 && row < DAYS && insideCell) {
            const day = dateGridRef.current[col]?.[row]
            if (day && day.date) {
                const wRect = wrapperRef.current?.getBoundingClientRect()
                setTooltip({ visible: true, x: e.clientX - (wRect?.left ?? 0), y: e.clientY - (wRect?.top ?? 0), date: day.date, count: day.count })
                return
            }
        }
        setTooltip(prev => prev.visible ? { ...prev, visible: false } : prev)
    }, [WEEKS, STEP, CELL, W, H])

    const handleMouseLeave = useCallback(() => setTooltip(prev => ({ ...prev, visible: false })), [])

    const labels = lang === 'pt'
        ? { d30: 'commits · 30 dias', yr: 'commits · 1 ano', noCommits: 'sem commits em', oneCommit: 'commit em', many: 'commits em' }
        : { d30: 'commits · 30 days', yr: 'commits · 1 year', noCommits: 'no commits on', oneCommit: 'commit on', many: 'commits on' }

    const tooltipText = tooltip.count === 0
        ? `${labels.noCommits} ${formatDate(tooltip.date, lang)}`
        : `${tooltip.count} ${tooltip.count === 1 ? labels.oneCommit : labels.many} ${formatDate(tooltip.date, lang)}`

    return (
        <div ref={wrapperRef} style={{ width: '100%', marginTop: '32px', marginBottom: '8px', position: 'relative', animation: 'fadeUp 0.7s ease 0.5s both' }}>
            {/* Terminal chrome */}
            <div style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border2)',
                borderRadius: '8px',
                overflow: 'hidden',
            }}>
                <div style={{
                    padding: '8px 14px',
                    borderBottom: '1px solid var(--border2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(0,0,0,0.2)',
                }}>
                    {['#ff5f57', '#febc2e', '#28c840'].map(c => (
                        <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, opacity: 0.8 }} />
                    ))}
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-dim)', marginLeft: '8px', letterSpacing: '0.05em' }}>
                        github contributions — {GITHUB_USERNAME}
                    </span>
                </div>
                <div style={{ padding: '16px', overflowX: 'auto' }}>
                    <canvas
                        ref={canvasRef}
                        width={W} height={H}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        style={{ display: 'block', margin: '0 auto', cursor: 'crosshair' }}
                    />
                </div>
                {stats && (
                    <div style={{
                        padding: '8px 16px 12px',
                        display: 'flex',
                        gap: '24px',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                    }}>
                        {[
                            { value: stats.last30, label: labels.d30 },
                            { value: stats.lastYear, label: labels.yr },
                        ].map(({ value, label }) => (
                            <span key={label} style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-dim)' }}>
                                <span style={{ color: 'var(--green)', fontWeight: 600 }}>{value.toLocaleString()}</span>
                                {' '}{label}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {tooltip.visible && tooltip.date && (
                <div style={{
                    position: 'absolute', left: tooltip.x, top: tooltip.y - 52,
                    transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: 50,
                    background: 'rgba(8,12,16,0.97)', border: '1px solid var(--border)',
                    borderRadius: '6px', padding: '6px 12px', whiteSpace: 'nowrap',
                    backdropFilter: 'blur(12px)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)',
                }}>
                    <span style={{
                        display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%',
                        background: tooltip.count > 0 ? 'var(--green)' : 'var(--text-dim)',
                        marginRight: '6px', verticalAlign: 'middle',
                        boxShadow: tooltip.count > 0 ? '0 0 6px var(--green)' : 'none',
                    }} />
                    <span style={{ color: tooltip.count > 0 ? 'var(--text)' : 'var(--text-dim)' }}>{tooltipText}</span>
                </div>
            )}
        </div>
    )
}

// ─── Home ─────────────────────────────────────────────────────────────────────

export function Home() {
    const [github, setGithub] = useState<GitHubProfile | null>(null)
    const [imgError, setImgError] = useState(false)
    const { lang, toggle: toggleLang } = useLang()
    const [activeSkillFilter, setActiveSkillFilter] = useState<'all' | keyof typeof SKILLS>('all')

    const t = T[lang]

    useEffect(() => {
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
            .then(r => r.json()).then(setGithub).catch(() => null)
    }, [])

    const avatarUrl = !imgError && github?.avatar_url
        ? github.avatar_url
        : `https://ui-avatars.com/api/?name=Lucas+Steffen&background=0d1117&color=34d399&size=200`

    return (
        <>
            <LangToggle lang={lang} onToggle={toggleLang} />

            <div style={{ position: 'relative', zIndex: 1 }}>
                <GridBackground />

                <div style={{ maxWidth: '740px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

                    {/* ── Hero ── */}
                    <div id="hero" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        paddingTop: '72px',
                        paddingBottom: '80px',
                    }}>

                        {/* Avatar */}
                        {/* Avatar */}
                        <div style={{
                            position: 'relative',
                            marginBottom: '16px',
                            animation: 'fadeIn 0.8s ease',
                        }}>
                            <div style={{
                                width: '104px',
                                height: '104px',
                                borderRadius: '50%',
                                padding: '2px',
                                background: 'linear-gradient(135deg, rgba(52,211,153,0.6), rgba(56,189,248,0.3))',
                                animation: 'glow-ring 3s ease-in-out infinite',
                            }}>
                                <img
                                    src={avatarUrl}
                                    onError={() => setImgError(true)}
                                    alt="Avatar"
                                    style={{
                                        width: '100%', height: '100%',
                                        borderRadius: '50%', objectFit: 'cover',
                                        display: 'block',
                                        border: '2px solid var(--bg)',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Greeting — fora do avatar, logo abaixo */}
                        <div style={{ animation: 'fadeUp 0.7s ease 0.2s both', marginBottom: '8px' }}>
                            <GreetingTyped lang={lang} />
                        </div>

                        {/* GitHub stats */}
                        {github && (
                            <div style={{
                                display: 'flex', gap: '6px', marginBottom: '20px',
                                flexWrap: 'wrap', justifyContent: 'center',
                                animation: 'fadeUp 0.6s ease 0.1s both',
                            }}>
                                {([
                                    { label: t.repos, value: github.public_repos },
                                    { label: t.followers, value: github.followers },
                                    { label: t.following, value: github.following },
                                ] as { label: string; value: number }[]).map(({ label, value }) => (
                                    <div key={label} style={{
                                        background: 'var(--bg2)',
                                        border: '1px solid var(--border2)',
                                        borderRadius: '4px',
                                        padding: '3px 12px',
                                        display: 'flex', gap: '6px', alignItems: 'center',
                                        fontFamily: 'var(--mono)',
                                    }}>
                                        <span style={{ color: 'var(--green)', fontSize: '12px', fontWeight: 700 }}>{value}</span>
                                        <span style={{ color: 'var(--text-dim)', fontSize: '10px', letterSpacing: '0.04em' }}>{label}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Name */}
                        <h1 style={{
                            color: 'var(--text)',
                            fontSize: 'clamp(28px, 5.5vw, 46px)',
                            fontWeight: 700,
                            fontFamily: 'var(--sans)',
                            lineHeight: 1.1,
                            marginBottom: '16px',
                            letterSpacing: '-0.03em',
                            animation: 'fadeUp 0.7s ease 0.2s both',
                        }}>
                            Lucas G. Amorim Steffen
                        </h1>

                        {/* Typed role */}
                        <div style={{ animation: 'fadeUp 0.7s ease 0.3s both' }}>
                            <TypedRole roles={t.roles} />
                        </div>

                        {/* Location */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            animation: 'fadeUp 0.7s ease 0.4s both',
                            marginBottom: '4px',
                        }}>
                            <MapPinIcon size={12} style={{ color: 'var(--text-dim)' }} />
                            <span style={{ fontFamily: 'var(--mono)', color: 'var(--text-dim)', fontSize: '11px', letterSpacing: '0.04em' }}>
                                {t.location}
                            </span>
                        </div>

                        {/* Snake */}
                        <GitHubContributionSnake username={GITHUB_USERNAME} lang={lang} />

                        {/* Social links */}
                        <div style={{
                            display: 'flex', gap: '8px', flexWrap: 'wrap',
                            justifyContent: 'center',
                            animation: 'fadeUp 0.7s ease 0.55s both',
                        }}>
                            {SOCIAL(lang).map(({ label, icon: Icon, href }) => (
                                <a key={label} href={href} target="_blank" rel="noreferrer" className="social-btn">
                                    <Icon size={14} />{label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ── About ── */}
                    <Section id="about" title={t.about}>
                        <RevealSection delay={50}>
                            <div className="card" style={{ padding: '24px 28px' }}>
                                {/* Terminal prompt line */}
                                <div style={{
                                    fontFamily: 'var(--mono)',
                                    fontSize: '11px',
                                    color: 'var(--text-dim)',
                                    marginBottom: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                }}>
                                    <TerminalIcon size={12} style={{ color: 'var(--green)' }} />
                                    <span style={{ color: 'var(--green)', opacity: 0.7 }}>cat</span>
                                    <span style={{ color: 'var(--cyan)' }}>README.md</span>
                                </div>
                                <p style={{
                                    color: 'var(--text-muted)',
                                    lineHeight: 1.85,
                                    fontSize: '14.5px',
                                    fontFamily: 'var(--sans)',
                                    fontWeight: 300,
                                }}>
                                    {t.aboutText}
                                </p>
                            </div>
                        </RevealSection>
                    </Section>

                    {/* ── Experience ── */}
                    <Section id="experience" title={t.experience}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {t.experience_items.map((exp, i) => (
                                <RevealSection key={i} delay={i * 70}>
                                    <div className="card" style={{ padding: '20px 24px' }}>
                                        {/* Top row */}
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            gap: '12px',
                                            flexWrap: 'wrap',
                                            marginBottom: '10px',
                                        }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                    <h3 style={{
                                                        color: 'var(--text)',
                                                        fontSize: '14px',
                                                        fontWeight: 600,
                                                        fontFamily: 'var(--sans)',
                                                    }}>{exp.role}</h3>
                                                    {exp.current && (
                                                        <span style={{
                                                            fontFamily: 'var(--mono)',
                                                            fontSize: '9px',
                                                            color: 'var(--green)',
                                                            background: 'var(--green-dim)',
                                                            border: '1px solid rgba(52,211,153,0.2)',
                                                            borderRadius: '3px',
                                                            padding: '1px 6px',
                                                            letterSpacing: '0.06em',
                                                        }}>
                                                            {t.present}
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ fontFamily: 'var(--mono)', color: 'var(--cyan)', fontSize: '12px' }}>{exp.company}</span>
                                                    {exp.location && (
                                                        <>
                                                            <span style={{ color: 'var(--text-dim)', fontSize: '10px' }}>·</span>
                                                            <span style={{ fontFamily: 'var(--mono)', color: 'var(--text-dim)', fontSize: '10px' }}>{exp.location}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            {!exp.current && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    <CalendarIcon size={11} style={{ color: 'var(--text-dim)' }} />
                                                    <span style={{
                                                        fontFamily: 'var(--mono)',
                                                        fontSize: '10px',
                                                        color: 'var(--text-dim)',
                                                        letterSpacing: '0.03em',
                                                    }}>{exp.period}</span>
                                                </div>
                                            )}
                                        </div>

                                        <p style={{
                                            color: 'var(--text-muted)',
                                            fontSize: '13.5px',
                                            lineHeight: 1.75,
                                            marginBottom: '12px',
                                            fontWeight: 300,
                                        }}>{exp.description}</p>

                                        {/* Tags */}
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            {exp.tags.map(tag => (
                                                <span key={tag} className="tag">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </RevealSection>
                            ))}
                        </div>
                    </Section>

                    {/* ── Projects ── */}
                    <Section id="projects" title={`${t.projects} (${t.projects_items.length})`}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {t.projects_items.map((p, i) => (
                                <RevealSection key={i} delay={i * 70}>
                                    <div className="card" style={{ padding: '20px 24px' }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            gap: '12px',
                                            flexWrap: 'wrap',
                                            marginBottom: '10px',
                                        }}>
                                            <div>
                                                <h3 style={{ color: 'var(--text)', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{p.title}</h3>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-dim)' }}>
                                                        <TagIcon size={10} />{p.type}
                                                    </span>
                                                    <span style={{ color: 'var(--text-dim)', fontSize: '10px' }}>·</span>
                                                    <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-dim)' }}>{p.date}</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={{
                                                    fontFamily: 'var(--mono)',
                                                    fontSize: '10px',
                                                    color: p.statusColor,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    letterSpacing: '0.05em',
                                                }}>
                                                    <CircleIcon size={8} weight="fill" style={{ filter: `drop-shadow(0 0 4px ${p.statusColor})` }} />
                                                    {p.status}
                                                </span>
                                                <a href={p.url} target="_blank" rel="noreferrer" style={{
                                                    display: 'flex', alignItems: 'center', gap: '4px',
                                                    color: 'var(--text-dim)', fontSize: '11px',
                                                    fontFamily: 'var(--mono)', textDecoration: 'none',
                                                    transition: 'color 0.2s',
                                                }}
                                                    onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--green)'}
                                                    onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-dim)'}
                                                >
                                                    <ArrowSquareOutIcon size={12} />{t.website}
                                                </a>
                                            </div>
                                        </div>

                                        <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: 1.75, marginBottom: '14px', fontWeight: 300 }}>
                                            {p.description}
                                        </p>

                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            {p.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                                        </div>
                                    </div>
                                </RevealSection>
                            ))}
                        </div>
                    </Section>

                    {/* ── Education ── */}
                    <Section id="education" title={t.education}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {t.education_items.map((e, i) => (
                                <RevealSection key={i} delay={i * 70}>
                                    <div className="card" style={{ padding: '20px 24px' }}>
                                        <div style={{
                                            display: 'flex', justifyContent: 'space-between',
                                            alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap', marginBottom: '6px',
                                        }}>
                                            <h3 style={{ color: 'var(--text)', fontSize: '14px', fontWeight: 600 }}>{e.institution}</h3>
                                            <span style={{ fontFamily: 'var(--mono)', color: 'var(--text-dim)', fontSize: '10px' }}>{e.period}</span>
                                        </div>
                                        <p style={{ fontFamily: 'var(--mono)', color: 'var(--cyan)', fontSize: '12px', marginBottom: '6px' }}>{e.degree}</p>
                                        {e.detail && <p style={{ fontFamily: 'var(--mono)', color: 'var(--text-dim)', fontSize: '11px', lineHeight: 1.6 }}>{e.detail}</p>}
                                    </div>
                                </RevealSection>
                            ))}
                        </div>
                    </Section>

                    {/* ── Skills ── */}
                    <Section id="skills" title={t.skills}>
                        <RevealSection>
                            {/* Filters */}
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '24px' }}>
                                {(['all', 'frontend', 'backend', 'database', 'tools'] as const).map(cat => (
                                    <button
                                        key={cat}
                                        className={`filter-btn${activeSkillFilter === cat ? ' active' : ''}`}
                                        onClick={() => setActiveSkillFilter(cat)}
                                    >
                                        {t.skillCategories[cat]}
                                    </button>
                                ))}
                            </div>

                            {/* Legend */}
                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
                                {[
                                    { color: '#f59e0b', text: t.skillLegend[0] },
                                    { color: '#38bdf8', text: t.skillLegend[1] },
                                    { color: '#34d399', text: t.skillLegend[2] },
                                ].map(({ color, text }) => (
                                    <div key={text.range} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: color, boxShadow: `0 0 5px ${color}88`, flexShrink: 0 }} />
                                        <span style={{ fontFamily: 'var(--mono)', color: 'var(--text-dim)', fontSize: '10px' }}>
                                            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{text.range}</span>
                                            {' — '}{text.label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Grid */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                                gap: '10px',
                            }}>
                                {(Object.entries(SKILLS) as [keyof typeof SKILLS, typeof SKILLS.frontend][])
                                    .filter(([cat]) => activeSkillFilter === 'all' || cat === activeSkillFilter)
                                    .flatMap(([, items]) => items)
                                    .map((skill, i) => {
                                        const color = levelColor(skill.level)
                                        const pct = `${skill.level * 10}%`
                                        return (
                                            <div
                                                key={skill.name}
                                                className="skill-card"
                                                title={levelLabel(skill.level, t.skillLegend)}
                                                style={{ animationDelay: `${i * 35}ms` }}
                                            >
                                                {skill.icon ? (
                                                    <img
                                                        src={skill.icon}
                                                        alt={skill.name}
                                                        width={36} height={36}
                                                        style={{
                                                            objectFit: 'contain',
                                                            filter: skill.name === 'Express.js' ? 'invert(1) opacity(0.7)' : 'none',
                                                        }}
                                                    />
                                                ) : (
                                                    <div style={{
                                                        width: '36px', height: '36px', borderRadius: '8px',
                                                        background: 'var(--bg3)',
                                                        border: '1px solid var(--border)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontFamily: 'var(--mono)',
                                                        fontSize: '14px', fontWeight: 700,
                                                        color: 'var(--green)',
                                                    }}>
                                                        {skill.name[0]}
                                                    </div>
                                                )}
                                                <span style={{
                                                    fontFamily: 'var(--mono)',
                                                    color: 'var(--text-muted)',
                                                    fontSize: '10px',
                                                    textAlign: 'center',
                                                    lineHeight: 1.3,
                                                    letterSpacing: '0.02em',
                                                }}>
                                                    {skill.name}
                                                </span>
                                                <div style={{ width: '100%' }}>
                                                    <div style={{
                                                        width: '100%', height: '3px', borderRadius: '99px',
                                                        background: 'rgba(255,255,255,0.05)', overflow: 'hidden',
                                                        marginBottom: '4px',
                                                    }}>
                                                        <div style={{
                                                            height: '100%',
                                                            borderRadius: '99px',
                                                            width: pct,
                                                            background: `linear-gradient(90deg, ${color}88, ${color})`,
                                                            boxShadow: `0 0 6px ${color}55`,
                                                        }} />
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                        <span style={{ fontFamily: 'var(--mono)', color, fontSize: '9px', fontWeight: 700 }}>
                                                            {skill.level}/10
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                            </div>
                        </RevealSection>
                    </Section>

                    {/* ── Blog ── */}
                    {t.blog_items.length > 0 && (
                        <Section id="blog" title={t.blog}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {t.blog_items.map((post, i) => (
                                    <RevealSection key={i} delay={i * 70}>
                                        <a href="#" className="card" style={{
                                            display: 'flex', justifyContent: 'space-between',
                                            alignItems: 'center', gap: '16px',
                                            padding: '16px 22px', textDecoration: 'none',
                                        }}>
                                            <div>
                                                <h3 style={{ color: 'var(--text)', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{post.title}</h3>
                                                <p style={{ fontFamily: 'var(--mono)', color: 'var(--text-dim)', fontSize: '11px' }}>{post.excerpt}</p>
                                            </div>
                                            <ArrowRightIcon size={16} style={{ color: 'var(--green)', flexShrink: 0 }} />
                                        </a>
                                    </RevealSection>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* ── Footer ── */}
                    <div style={{
                        textAlign: 'center',
                        paddingBottom: '48px',
                        fontFamily: 'var(--mono)',
                        color: 'var(--text-dim)',
                        fontSize: '11px',
                        letterSpacing: '0.06em',
                    }}>
                        {t.footer.replace('{year}', String(new Date().getFullYear()))}
                    </div>
                </div>
            </div>
        </>
    )
}
