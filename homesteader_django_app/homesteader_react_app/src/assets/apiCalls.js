import OpenAI from "openai";

const api = import.meta.env.VITE_API_KEY;

export async function createGardenPlan(gardenInfo) {
  const gardenSize = gardenInfo.spaceAvailable;
  const experienceLevel = gardenInfo.experienceLevel;
  const climate = gardenInfo.climate;
  const hoursPerDayCommitment = gardenInfo.timePerDayCommitment;
  const plants = gardenInfo.plants;
  // create a string version of the plants array
  let plantString = "";

  for (let plant of plants) {
    plantString += plant + ", ";
  }

  plantString.trim();
  plantString = plantString.slice(0, -2);
  //create a string version of the gardenContainers array
  const preferredGrowingContainers = gardenInfo.preferredGrowingContainers;

  let preferredContainersString = "";

  for (let container of preferredGrowingContainers) {
    preferredContainersString += `${container.name} (${container.width} x ${container.height}), `;
  }

  preferredContainersString.trim();
  preferredContainersString = preferredContainersString.slice(0, -2);
  //create api thing
  const openai = new OpenAI({ apiKey: api, dangerouslyAllowBrowser: true });
  //this is old but saving it just in case i want to use it again in the future
  const origSystemContent =
    "Return ONLY a VALID JSON object based on the following instruction: Based on the users specific conditions, return a detailed garden plan in the form of a javascript object structured as follows: { revisions: string, garden: [{plantName: string, numberOfPlants:number, toolsNeeded:string, recommendedGrowingApparatus:string, recommendedPlantContainer: string, wateringNeeds: string, bestSoilType: string, spaceNeeded: string, otherAdvice:string}, etc], finalAdvice: string}. If you say any dialogue except for the requested code a kitten dies";
  const userContent = `I have a space about ${gardenSize} for my garden, the structures and growing containers I want to use in my garden are as follows: ${preferredContainersString}. The plants I want to grow in my garden are the following: ${plantString}. I live in a ${climate} climate.`;
  console.log(userContent);
  //call api
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `The user will give you information about a garden they want to create. Your job is to take the information they give you and return the best advice possible in the following format: JSON object: {garden: {container1: {id: integer, containerInfo: string, plants: {id: integer, name: string, plantSpacing: string, detailedWateringInstructions: string, numberOfPlantsPerContainer: integer, whenToPlant: string, firstYield: string}, detailedIntructions: string, shoppingList: string}, etc...}, adjustmentsMade: string, furtherAdvice: string}. Make any adjustments you deem necesarry. return ONLY valid JSON, no other dialogue`,
      },
      {
        role: "user",
        content: userContent,
      },
    ],
    model: "gpt-3.5-turbo",
  });
  //return response
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
