const titleDom = (title) =>
  domFromHTML(`
    <div class="flex"><h1 class="center">${title}</h1></div>
  `)

const headingDom = (round, tournamentIsOver) =>
  tournamentIsOver
    ? domFromHTML(`<div class=flex><h2 class="center">Endstand</h2></div>`)
    : domFromHTML(`
      <div class=flex>
        <h2 class="center">Zwischenstand nach Runde ${round}</h2>
      </div>
    `)

const tableDom = (ranking) => {
  const dom = domFromHTML(`<table class="result-table"></table>`)
  const rows = []
  rows.push(
    domFromHTML(`
      <tr>
        <th>Platz</th>
        <th>Name</th>
        <th>Punkte</th>
        <th>Buchholz</th>
      </tr>
    `)
  )
  for (const [index, [player, points, buchholz]] of ranking.entries()) {
    rows.push(
      domFromHTML(`
      <tr>
        <td>${index + 1}</td>
        <td>${player}</td>
        <td>${points}</td>
        <td>${buchholz}</td>
      </tr>
    `)
    )
  }
  dom.replaceChildren(...rows)
  return dom
}

const createRankingTable = (participants, history) => {
  if (!participants) return

  const ranking = calculateRanking(participants, history)
  const title = load('title')
  const roundCount = load('roundCount')
  const currentRound = calculateCurrentRound()
  let rankedRound = 0
  if (currentRound) {
    rankedRound = roundIsOpen(history[currentRound - 1])
      ? currentRound - 1
      : currentRound
  }

  const dom = domFromHTML(`<div id="ranking-table"></div>`)

  dom.replaceChildren(
    titleDom(title),
    headingDom(rankedRound, tournamentHasFinished(history, roundCount)),
    tableDom(ranking)
  )
  document.getElementById('tournament-data').replaceChildren(dom)
}
