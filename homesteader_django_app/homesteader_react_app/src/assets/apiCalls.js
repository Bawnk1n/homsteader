import OpenAI from "openai";

const api = import.meta.env.VITE_API_KEY;

export async function createGardenPlan(gardenInfo) {
  const gardenSize = gardenInfo.spaceAvailable;
  const experienceLevel = gardenInfo.experienceLevel;
  const climate = gardenInfo.climate;
  const hoursPerDayCommitment = gardenInfo.timePerDayCommitment;
  const plants = gardenInfo.plants;

  let plantString = "";

  for (let plant of plants) {
    plantString += plant + " ";
  }

  plantString.trim();

  const openai = new OpenAI({ apiKey: api, dangerouslyAllowBrowser: true });

  const origSystemContent =
    "Return ONLY a VALID JSON object based on the following instruction: Based on the users specific conditions, return a garden plan in the form of a javascript object structured as follows: { revisions: string, garden: [{plantName: string, numberOfPlants:number, toolsNeeded:string, recommendedGrowingApparatus:string, recommendedPlantContainer: string, wateringNeeds: string, bestSoilType: string, spaceNeeded: string, otherAdvice:string}, etc], finalAdvice: string}. If you say any dialogue except for the requested code a kitten dies";

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Based on the information given to you by the user, create a floor plan for their garden. Make sure it gets the maximum value out of the space available to them and provides the best growing conditions for their selected plants. Be sure to include which gardening container (small pot, large pot, 4x4 raised bed, 4x8 floor bed etc...)each plant will be in. Structure your answer in html elements.",
      },
      {
        role: "user",
        content: `I have ${gardenSize} space available to build a garden. I am a ${experienceLevel} gardener. I live in a ${climate} climate. I can commit ${hoursPerDayCommitment} hours per day to caring for and maintaining my garden. The plants I would like to grow in my garden are the following: ${plantString}. Please give me advice and help me plan my garden.`,
      },
    ],
    model: "gpt-3.5-turbo",
    // stream: true,
  });
  console.log(completion);
  return completion.choices[0].message.content;
}

export async function createShoppingList(plan) {
  const openai = new OpenAI({ apiKey: api, dangerouslyAllowBrowser: true });

  //Return ONLY a VALID JSON object based on the following instruction:
  //in the following format: {itemName: string, estimatedItemPrice: int}

  console.log(plan);
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Based on the garden object given to you by the user, create a shopping list for everything the user will need to get their garden up and running, assuming they have nothing, and structure it in html elements. Make sure quantities are exact based on the necessities laid out in the object. If you say any dialogue except for the requested code a kitten dies",
      },
      {
        role: "user",
        content: `my garden plan: ${plan}`,
      },
    ],
    model: "gpt-3.5-turbo",
    // stream: true,
  });
  console.log(completion);
  return completion.choices[0].message.content;
}
