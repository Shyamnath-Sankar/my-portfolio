# DESIGN.md: Shyamnath Sankar, portfolio (v3: "From noise to signal")

History: v1 (kolam) and v2 (agent-run UI borrowed from HailBrowser) were rejected by the owner.
Owner's brief: unique, black / white / mint / orange, strong motion graphics, separate project
pages, English only, and the portfolio's design must stay separate from the projects' own UI.

## Concept card

```
Idea:        From noise to signal. A live WebGL field of contour lines (noise) that straightens
             into parallel flowing signal lines wherever the work is.
Anchor:      his products all turn messy inputs (PDFs, spreadsheets, databases, the open web)
             into clear answers.
Signature:   the field: each section sets data-signal (0 noise .. 1 signal); scroll tweens the
             shader between them; orange pulses run along the lines; the pointer bends it.
Motion verb: resolve. Headlines rise out of a clip; lines settle from chaos into order.
Screenshot:  huge white name on black, a tangle of mint contours on the right, the project index.
Projects:    each product's own UI sits inside a neutral browser frame, clearly separate from the
             portfolio's design. Projects without screenshots get an animated generated cover
             with a typographic line about what the product does.
Pause:       "Motion on/off" in the header freezes the field, the marquee and CSS animation.
```

Palette, type and grid as below (v2 values kept): black #0c0d0c, white #f3f4f1, mint #8ff0c8,
orange #ff6b2c, paper chapters with ink #0c0d0c. Anek (display, width axis) + Host Grotesk.

## Concepts

| | A. The run (material) | B. Retrieval (material) | C. Changelog (formal) |
|---|---|---|---|
| Idea | The visitor gives one task, "show me what Shyamnath builds", and the page carries it out like his own browser agent: an orange agent cursor moves from project to project, steps tick to done in mint, and a Stop button halts it | scrolling is a query; sections are chunks with similarity scores | the whole site is one long release log |
| Anchor | HailBrowser, his open-source agent that drives a real browser tab with a visible cursor, a status pill and a Stop button; SelectStar's "every step shown" rule | his RAG work | he ships often |
| O / F / Fe / P | 4 / 5 / 4 / 2 | 3 / 4 / 3 / 4 | 2 / 3 / 5 / 4 |

**Pick A.** It is built from the interface of his own product, it makes the portfolio's
navigation itself a demo of what he builds, and the Stop button doubles as the pause control
for all ambient motion (WCAG 2.2.2).

## Concept card

```
Idea:        The site is an agent run. Task: "Show me what Shyamnath builds." The page executes it
             in the open: every step labelled, every action visible, and you can stop it.
Metaphor:    an AI agent driving a browser tab (HailBrowser): agent cursor, status pill, tool-call
             log, mint "done", the animated border around the tab being driven.
Signature:   an orange agent cursor that glides to each project as you scroll and "clicks" it;
             the project gets a mint focus border, its step ticks to done in the run panel, and
             the pill counts "2 of 5". At rest the cursor keeps a small thinking drift.
Emotion:     first 3 s: precise, alive, a little uncanny. Something is working on this page for you.
Motion verb: executed. Glide, then a crisp click (press and release); labels decode; borders draw.
Screenshot:  huge white name on black, the run panel with a mint progress bar, the orange cursor
             parked on step 1.
```

## Art direction

| Role | Hex | Use |
|---|---|---|
| ground | `#0c0d0c` | black floor |
| panel | `#151716` | run panel, posters |
| ink | `#f3f4f1` | all text on black |
| muted | `#a3a8a4` | secondary text (AA on black) |
| mint | `#8ff0c8` | done states, progress, focus borders, the light chapter's accent |
| orange | `#ff6b2c` | the agent: cursor, CTA fill, Stop. Used rarely |
| paper | `#f3f4f1` ground with `#0c0d0c` ink | light chapter (statement, system, facts) |

Why mint on black is fine here: the avoid-list warns about acid green on black as a whole
identity. Here mint means one thing only (done/verified), orange means the agent acting, and the
site alternates black and paper chapters.

**Type:** Anek (Ek Type) for display, width axis 75 to 125, used kinetically on hover; Host
Grotesk for text; JetBrains Mono only for the agent's own voice (tool calls, status, timings).

**Grid:** 12 columns; a step lane in columns 1 to 2 holds each project's step label, so the
cursor travels down a clear lane. **Shape:** 12px radius for panels and pills (the agent UI),
square images. **Motion:** expo eases; cursor glide 0.9 s, click 0.18 s; borders draw 0.7 s.

| Role | Treatment |
|---|---|
| CTA | orange floods from the pointer side, label turns black |
| Nav | underline draws; current page in mint |
| Project | mint border draws around the media, title stretches (wdth 100 to 114), arrow travels |
| Utility | colour and underline |

**Idle:** the cursor drifts slightly and the status dots pulse while the visitor reads. Stop
pauses both (and they are off under reduced motion).

**Loader (desktop, home only):** `agent.connect()` boot line with a real-progress counter; it
hands into the hero's status pill. **Transition:** a black panel shows the tool call
`navigate("/work/selectstar/")` and a mint progress line, then lifts. **404:** the run log of a
failed navigation, with a link back.
