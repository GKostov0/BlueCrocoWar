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
            
            _playerOne.TurnPlayed = false;
            _playerTwo.TurnPlayed = false;
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

            string? roundWinnerId = null;
            Card? opponentCard = null;
            PlayerModel? opponent = null;
            bool handDelt = HandleHandResult(player, out roundWinnerId, out opponentCard, out opponent);

            bool gameOver = false;
            string? gameWinnerId = null;
            
            if (_playerOne.PlayerCards.Count == 0)
            {
                gameOver = true;
                gameWinnerId = _playerTwo.UserId;
            }
            else if (_playerTwo.PlayerCards.Count == 0)
            {
                gameOver = true;
                gameWinnerId = _playerOne.UserId;
            }
            else if (_playerOne.PlayerCards.Count == 52)
            {
                gameOver = true;
                gameWinnerId = _playerOne.UserId;
            }
            else if (_playerTwo.PlayerCards.Count == 52)
            {
                gameOver = true;
                gameWinnerId = _playerTwo.UserId;
            }

            PlayCardResult result = new PlayCardResult
            {
                PlayerId = player.UserId,
                Rank = rank,
                Suit = suit,
                CardsLeft = handDelt ? player.PlayerCards.Count : player.PlayerCards.Count - 1,
                ClearUI = handDelt,
                RoundWinnerId = roundWinnerId,
                GameOver = gameOver,
                GameWinnerId = gameWinnerId
            };

            if (handDelt && opponentCard != null && opponent != null)
            {
                result.OpponentPlayerId = opponent.UserId;
                result.OpponentRank = opponentCard.Rank.ToString();
                result.OpponentSuit = opponentCard.Suit.ToString();
                result.OpponentCardsLeft = opponent.PlayerCards.Count;
            }

            Console.WriteLine($"Player {player.UserId} played {rank} of {suit}. Cards left: {result.CardsLeft} (was {initialCount})");

            return result;

        }

        private bool HandleHandResult(PlayerModel currentPlayer, out string? roundWinnerId, out Card? opponentCard, out PlayerModel? opponent)
        {
            roundWinnerId = null;
            opponentCard = null;
            opponent = null;
            bool handDelt = false;

            if (_playerOne.TurnPlayed && _playerTwo.TurnPlayed)
            {
                if (_playerOne.PlayerCards.Count > 0 && _playerTwo.PlayerCards.Count > 0)
                {
                    handDelt = true;

                    Card p1Card = _playerOne.PlayerCards.Peek();
                    Card p2Card = _playerTwo.PlayerCards.Peek();

                    if (currentPlayer == _playerOne)
                    {
                        opponentCard = p2Card;
                        opponent = _playerTwo;
                    }
                    else
                    {
                        opponentCard = p1Card;
                        opponent = _playerOne;
                    }

                    _playerOne.PlayerCards.Dequeue();
                    _playerTwo.PlayerCards.Dequeue();

                    // Player one takes
                    if (p1Card.Rank > p2Card.Rank)
                    {
                        _playerOne.PlayerCards.Enqueue(p1Card);
                        _playerOne.PlayerCards.Enqueue(p2Card);
                        roundWinnerId = _playerOne.UserId;
                    }
                    else if (p2Card.Rank > p1Card.Rank)
                    {
                        // Player 2 takes
                        _playerTwo.PlayerCards.Enqueue(p1Card);
                        _playerTwo.PlayerCards.Enqueue(p2Card);
                        roundWinnerId = _playerTwo.UserId;
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
                }

                _playerOne.TurnPlayed = false;
                _playerTwo.TurnPlayed = false;
            }
            else
            {
            }

            return handDelt;
        }
    }
}