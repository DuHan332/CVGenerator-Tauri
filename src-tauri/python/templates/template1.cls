\ProvidesClass{deedy-resume-reversed}[2025/01/29 CV class]
\NeedsTeXFormat{LaTeX2e}

% Options
\DeclareOption{print}{\def\@cv@print{}}
\DeclareOption*{\PassOptionsToClass{\CurrentOption}{article}}
\ProcessOptions\relax

% Base class: article
\LoadClass{article}

% Page geometry
\usepackage[hmargin=1.25cm, vmargin=0.75cm]{geometry}

% Hyperlinks (no color boxes)
\usepackage[hidelinks]{hyperref}

% Publications/citations
\usepackage{cite}
\renewcommand\refname{\vskip -1.5cm}

% Color definitions
\usepackage[usenames,dvipsnames]{xcolor}
\definecolor{date}{HTML}{666666}
\definecolor{primary}{HTML}{2b2b2b}
\definecolor{headings}{HTML}{6A6A6A}
\definecolor{subheadings}{HTML}{333333}

% Instead, for pdfLaTeX, load standard LaTeX font packages:
\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}

% Date command (removes \fontspec usage)
\usepackage[absolute]{textpos}
\usepackage[UKenglish]{isodate}
\setlength{\TPHorizModule}{1mm}
\setlength{\TPVertModule}{1mm}
\newcommand{\lastupdated}{
  %\begin{textblock}{60}(155,5)
    \color{date}\small
    Last Updated on \today
  \end{textblock}%
}

% Name command (removes \fontspec usage)
\newcommand{\namesection}[3]{
  \centering{
    \fontsize{40pt}{60pt}\selectfont #1
  }\\[5pt]
  \centering{
    \color{headings}\fontsize{11pt}{14pt}\selectfont #2
  }\\[5pt]
  \centering{
    \color{headings}\fontsize{11pt}{14pt}\selectfont #3
  }
  \noindent\makebox[\linewidth]{\color{headings}\rule{\paperwidth}{0.4pt}}
  \vspace{-15pt}
}

% Titles and spacing
\usepackage{titlesec}
\titlespacing{\section}{0pt}{0pt}{0pt}
\titlespacing{\subsection}{0pt}{0pt}{0pt}
\newcommand{\sectionsep}{\vspace{8pt}}

% Section heading
\titleformat{\section}{%
  \color{headings}\scshape\fontsize{16pt}{24pt}\selectfont \raggedright\uppercase
}{}{0em}{}

% Subsection heading
\titleformat{\subsection}{%
  \color{subheadings}\bfseries\fontsize{12pt}{12pt}\selectfont\uppercase
}{}{0em}{}

% Runsubsection command
\newcommand{\runsubsection}[1]{%
  \color{subheadings}\bfseries\fontsize{12pt}{12pt}\selectfont\uppercase{#1}%
  \normalfont
}

% Descriptors
\newcommand{\descript}[1]{%
  \color{subheadings}\raggedright\scshape\fontsize{11pt}{13pt}\selectfont
  {#1\\} \normalfont
}

% Location
\newcommand{\location}[1]{%
  \color{subheadings}\raggedright\fontsize{10pt}{12pt}\selectfont
  {#1} \normalfont
}

% Bullet lists with fewer gaps
\newenvironment{tightemize}{
  \vspace{-\topsep}\begin{itemize}\itemsep1pt \parskip0pt \parsep0pt
}
{
  \end{itemize}\vspace{-\topsep}
}

\newcommand{\customheading}[1]{%
  {\color{headings}\scshape\fontsize{16pt}{24pt}\selectfont\raggedright\uppercase{#1}\par\vspace{0.2em}}%
}