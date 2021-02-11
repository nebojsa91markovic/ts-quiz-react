import React, { useState } from "react";
import { QuestionState, fetchQuizQuestions, Difficulty } from "./API";
import QuestionCard from "./Components/QuestionCard";
import { GlobalStyle, Wrapper } from "./AppStyles";
import Spinner from "./images/Spinner-1s-200px.svg";
//loading.io

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const App = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(true);
  const [userDifficulty, setUserDifficulty] = useState<string>(Difficulty.EASY);

  const TOTAL_QUESTIONS = 10;

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      userDifficulty
    );

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };

  const startNewGame = () => {
    setGameOver(false);
  };

  const checkAnswer = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = event.currentTarget.value;
      const correct = questions[number].correct_answer === answer;
      if (correct) setScore((prevState) => prevState + 1);
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prevState) => [...prevState, answerObject]);
    }
  };

  const nextQuestion = () => {
    const nextQuestion = number + 1;

    nextQuestion === TOTAL_QUESTIONS
      ? setGameOver(true)
      : setNumber(nextQuestion);
  };

  const selectDiff = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUserDifficulty(event.currentTarget.value);
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper className="App">
        <h1>QUIZ.tsx</h1>
        {gameOver && (
          <>
            <select
              name="diffSelect"
              value={userDifficulty}
              onChange={selectDiff}
            >
              <option value={Difficulty.EASY}>{Difficulty.EASY}</option>
              <option value={Difficulty.MEDIUM}>{Difficulty.MEDIUM}</option>
              <option value={Difficulty.HARD}>{Difficulty.HARD}</option>
            </select>
            <button className="start" onClick={startTrivia}>
              Start
            </button>
          </>
        )}

        {!gameOver && <p className="score">Score: {score}</p>}
        {loading && <img src={Spinner} alt="Loading Questions..." />}
        {!loading && !gameOver && (
          <QuestionCard
            questionNum={number + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}
        {!gameOver &&
          !loading &&
          userAnswers.length === number + 1 &&
          number !== TOTAL_QUESTIONS - 1 && (
            <button className="next" onClick={nextQuestion}>
              Next Question
            </button>
          )}
      </Wrapper>
    </>
  );
};

export default App;
