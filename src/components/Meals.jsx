import { useState } from "react";
import MealItem from "./MealItem";
import useHttp from "../hooks/useHttp";
const requestConfig = {};
export default function Meals() {
  const {
    data: loadedMeals,
    isLoading,
    error,
  } = useHttp("http://localhost:3000/meals" , requestConfig , []);
  if(isLoading){
    return <p className="center">Fetching Meals..</p>
  }
  if(error){
    return <Error title="Failed to  Fetch meals" message={error} />
  }
  console.log(loadedMeals)
  return (
    <ul id="meals">
      {loadedMeals.map((meal) => (
        <MealItem key={meal.id} meal={meal} />
      ))}
    </ul>
  );
}
