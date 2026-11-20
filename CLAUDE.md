## De gedeelde map `.plan`

Zet elk plan, elk onderzoek en elke aantekening in `.plan/`. Maak `.plan/` aan
als de map ontbreekt. Je werk blijft dan staan als een worktree verdwijnt.

Deze afspraak staat in `CLAUDE.md` en niet in `AGENTS.md`. De koppeling komt van
een hook in `.claude/settings.json`. Een andere agent leest dat bestand niet, en
krijgt de koppeling dus nooit.

`.plan/` staat één keer in de hoofdmap van de repository. Een worktree staat in
`.claude/worktrees/<naam>/` en krijgt een symbolische koppeling naar dezelfde
map.

- `.plan/` staat niet in git. De inhoud hoort bij de ontwikkelaar, niet bij een
  tak.
- De hook `.claude/hooks/worktree-link` legt de koppeling. De hook loopt bij de
  start van een sessie.
- Gebruik het korte pad `.plan/<naam>.md`. Schrijf het pad van de hoofdmap niet
  voluit, want de koppeling wijst het korte pad al naar de hoofdmap.
- Verwijs niet naar een bestand in `.plan/` vanuit code, een commit-tekst, een
  pull-request-tekst of een issue. Alleen de machine van de ontwikkelaar heeft
  dat bestand.

Ontbreekt de koppeling in een worktree? Herstel de koppeling in drie stappen:

1. Controleer met `ls -ld .plan` of `.plan/` een symbolische koppeling is.
2. Verplaats de bestanden naar `.plan/` in de hoofdmap als `.plan/` een echte
   map is.
3. Start de sessie opnieuw.
