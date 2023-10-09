# Pokémon Top Trumps

- Card game
- Compare stats
- Higher stat wins
- Using Pokemon API, TypeScript, React

## useEffect

in the API call, we need to wait for data to come back
Once it has, we can render a card

We'll do this twice, once for the user and once for opponent

UseEffect will run before the component is rendered, grabbing data ready for when it does render

We wrap our fetch call in the useEffect, with a state to hold the data once it has come back

async await is crucial with fetch, we need the promise to resolve before we can use the data

## Architecture

I started with the useEffect in the App layer, I want to move it down out of this and use App for the main page structure

App will hold a state for whether the game has started, and the main components.

- Header
- Play Button / Game Board
- Footer

## Double load issue

When the cards render, the useEffect runs twice. One pokemon appears briefly before a second is rendered

## Destructuring

When definining a React Component, we need to destructure props. Why is this?

Destructuring is a convenient way to access specific properties from an object, in this case, the props object. It makes the code more readable and can save you from typing props. multiple times. However, it's not required – you can always use props.name if you prefer.

Remember that props are passed to a component as an object, so you need to access them as properties of that object.

## Rendering two different Pokemon

```tsx
const GameBoard: FC = () => {
  const [apiData, setApiData] = useState(null);
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);

  function randomID() {
    return Math.floor(Math.random() * 151);
  }

  useEffect(() => {
    async function getPokemon() {
      const id: string = String(randomID());
      const url: string = `https://pokeapi.co/api/v2/pokemon/${id}`;

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Bad response");
        }
        const data = await response.json();
        setApiData(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }

    getPokemon();
  }, []);

  return (
    <section className="GameBoard">
      {apiData && (
        <PlayerCard data={apiData} setPlayerChoice={setPlayerChoice} />
      )}

      {apiData && <OpponentCard data={apiData} playerChoice={playerChoice} />}
    </section>
  );
};
```

to this
