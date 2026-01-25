using BlueCrocoWar.Domain.Common.Enums;
using BlueCrocoWar.Domain.Common.Models;

namespace BlueCrocoWar.Domain.Services
{
    public class GameDealer
    {
        private PlayerModel _playerOne;
        private PlayerModel _playerTwo;

        public Card[] PlayCards { get; private set; } =
            Enum.GetValues<CardSuit>().SelectMany(suit =>
            Enum.GetValues<CardRank>().Select(rank => new Card(suit, rank)))
            .ToArray();

        // Fisher-Yates Shuffle
        public void ShuffleCards()
        {
            var random = new Random();

            for (int i = PlayCards.Length - 1; i > 0; i--)
            {
                int j = random.Next(i + 1);
                (PlayCards[i], PlayCards[j]) = (PlayCards[j], PlayCards[i]);
            }
        }

        public void DealToPlayers(PlayerModel player1, PlayerModel player2)
        {
            int half = PlayCards.Length / 2;

            _playerOne = player1;
            _playerTwo = player2;

            _playerOne.PlayerCards = new Queue<Card>(PlayCards.Take(half));
            _playerTwo.PlayerCards = new Queue<Card>(PlayCards.Skip(half).Take(half));
        }

        public PlayCardResult? PlayCard(PlayerModel player)
        {
            if (player.TurnPlayed || player.PlayerCards.Count == 0)
                return null;

            player.TurnPlayed = true;

            Card playedCard = player.PlayerCards.Peek();
            string rank = playedCard.Rank.ToString();
            string suit = playedCard.Suit.ToString();
            int initialCount = player.PlayerCards.Count;

            bool handDelt = HandleHandResult();

            PlayCardResult result = new PlayCardResult
            {
                PlayerId = player.UserId,
                Rank = rank,
                Suit = suit,
                CardsLeft = handDelt ? player.PlayerCards.Count : player.PlayerCards.Count - 1,
                ClearUI = handDelt
            };
            Console.WriteLine($"Player {player.UserId} played {rank} of {suit}. Cards left: {result.CardsLeft} (was {initialCount})");

            return result;

        }

        private bool HandleHandResult()
        {
            bool handDelt = false;

            if (_playerOne.TurnPlayed && _playerTwo.TurnPlayed)
            {
                if (_playerOne.PlayerCards.Count > 0 && _playerTwo.PlayerCards.Count > 0)
                {
                    handDelt = true;

                    Card p1Card = _playerOne.PlayerCards.Dequeue();
                    Card p2Card = _playerTwo.PlayerCards.Dequeue();

                    // Player one takes
                    if (p1Card.Rank > p2Card.Rank)
                    {
                        _playerOne.PlayerCards.Enqueue(p1Card);
                        _playerOne.PlayerCards.Enqueue(p2Card);
                    }
                    else if (p2Card.Rank > p1Card.Rank)
                    {
                        // Player 2 takes
                        _playerTwo.PlayerCards.Enqueue(p1Card);
                        _playerTwo.PlayerCards.Enqueue(p2Card);
                    }
                    else
                    {
                        // Equal - put cards back on bottom
                        _playerOne.PlayerCards.Enqueue(p1Card);
                        _playerTwo.PlayerCards.Enqueue(p2Card);
                    }
                }
                else
                {
                    // Someones dosnt have cards
                }

                _playerOne.TurnPlayed = false;
                _playerTwo.TurnPlayed = false;
            }
            else
            {
                // Someone hasnt played their turn yet...
            }

            return handDelt;
        }
    }
}