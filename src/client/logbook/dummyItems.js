
const randBetween = (min, max) => Math.floor(Math.random()*(max-min+1)+min);

const NAMES = [
    'Suzie Queth',
    'Daenarys Smith',
    'Tom Johnson',
    'Jackie Fuentes'
]

const randomName = () => NAMES[randBetween(1,4) - 1]

const dummyItems = Array.from({ length: 20 }, (x, i) => i)
.reduce((sum, i) => {
    sum.items.push({
        user: randomName(),
        isSuccess: randBetween(1,4) % 2,
        created: new Date(sum.date - (i * (45 * 60 * 1000)))
    })
    return sum
}, { items: [], date: Date.now() })
.items;







export default dummyItems