import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import './Deck.css';

const Deck = () => {

    const backOfCard = "https://deckofcardsapi.com/static/img/back.png";
    const deckId = useRef();
    const [cardsArray, setCardsArray] = useState([]);
    const [cardsRemaining, setCardsRemaining] = useState(52);

    function decrement() {
        if(cardsRemaining === 0) {
            alert("Error: No cards remaining!");
        }
         else setCardsRemaining( c => c - 1);
    }

    function getRotation() {
        let multiplier = (-1) ** Math.round(Math.random() * 10);
        let r = Math.random() * 45 * multiplier;
        return Math.round(r);
    }

    async function shuffleCards(evt) {
        const btn = evt.target;
        btn.disabled = true;
        const url = `https://deckofcardsapi.com/api/deck/${deckId.current}/shuffle/`;
        try {
            await axios.get(url);
        } catch(err) {
            alert(err);
        }

        setCardsArray([]);
        setCardsRemaining(52);
        btn.disabled = false;
    }

    useEffect(function fetchDeckWhenMounted() {
        async function fetchDeck() {
            const url = "https://deckofcardsapi.com/api/deck/new/shuffle/";
            try {
                const result = await axios.get(url);
                deckId.current = result.data.deck_id;
            } catch(err) {
                alert(err);
            }
            
        }
        fetchDeck();
    }, []);

    useEffect(function fetchCardOnChange() {
        async function fetchCard() {
            const url = `https://deckofcardsapi.com/api/deck/${deckId.current}/draw/`;
            try {
                const result = await axios.get(url);
                setCardsArray(cardArray => {
                    const newCA = cardArray.slice();
                    newCA.push({img: result.data.cards[0]["image"],
                                rotation: `rotate(${getRotation()}deg)`
                               });
                    return newCA;
                });
            } catch(err) {
                alert(err);
            }
        }
        if(deckId.current) {
            fetchCard();
        }
    }, [cardsRemaining]);

    return (
        <>
        <button onClick={decrement}>GIMME CARD</button>
        <div>
            {cardsArray.map(c => (<img src={c.img}
                                       className='card'
                                       alt='A playing card'
                                       style={{transform: c.rotation }}/>))
            }
        </div>
        <button onClick={shuffleCards}>Shuffle</button>
        </>
    );
};

export default Deck;
