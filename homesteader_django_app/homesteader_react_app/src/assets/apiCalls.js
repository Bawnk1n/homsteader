import OpenAI from "openai";

const api = import.meta.env.VITE_API_KEY;

//for creating the initial plan on the createGarden page
export async function createGardenPlan(gardenInfo) {
  const gardenSize = gardenInfo.spaceAvailable;
  const climate = gardenInfo.climate;
  const plants = gardenInfo.plants;
  const preferredGrowingContainers = gardenInfo.preferredGrowingContainers;

  // create a string version of the plants array
  let plantString = "";

  for (let plant of plants) {
    plantString += plant + ", ";
  }

  plantString.trim();
  plantString = plantString.slice(0, -2);
  //create a string version of the gardenContainers array

  //make a count of each container
  const containerCount = {};
  for (let container of preferredGrowingContainers) {
    if (!containerCount[container.name]) {
      containerCount[container.name] = {
        count: 1,
        width: container.width,
        height: container.height,
        diameter: container.diameter,
      };
    } else {
      containerCount[container.name].count += 1;
    }
  }

  let newPreferredContainersString = "";
  for (const containerKey in containerCount) {
    const container = containerCount[containerKey];
    if (!container.diameter) {
      newPreferredContainersString += `${container.count} ${containerKey}${
        container.count > 1 ? "s" : null
      } (${container.width}ft x ${container.height}ft), `;
    } else {
      newPreferredContainersString += `${container.count} ${containerKey}${
        container.count > 1 ? "s" : null
      } (${container.diameter} diameter), `;
    }
  }

  newPreferredContainersString.trim();
  newPreferredContainersString = newPreferredContainersString.slice(0, -2);

  //create api thing
  const openai = new OpenAI({ apiKey: api, dangerouslyAllowBrowser: true });

  const userContent = `I have a space about ${gardenSize} for my garden, the structures and growing containers I want to use in my garden are as follows: ${newPreferredContainersString}. The plants I want to grow in my garden are the following: ${plantString}. I live in a ${climate} climate.`;
  console.log(userContent);
  //call api
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a garden planner, your job is to take the information that the user gives you and organize which plants should go into which container, calculating that there will be enough space for each plant, and if needs be you are allowed to make slight variations like removing plants and adding containers to maximize the usage of the user's space as long as it still suits their needs. Return your answer in the following format: JSON object: {singularContainers: [{id: integer, containerInfo: string, plants: [{id: integer, name: string, plantSpacing: string, detailedWateringInstructions: string, numberOfPlantsPerContainer: integer, whenToPlant: string, firstYield: string, plantingInstructions: string, generalTipsAndTricks: string}, detailedInstructions: string, generalTipsAndTricks: string,  shoppingList: string}, etc...]}, etc...], specificRevisionsMade: {plantsRemoved: [name, name, etc], plantsAdded: [name, name, etc], containersRemoved: [name, name, etc], containersAdded: [name, name, etc]}, furtherAdvice: string}. Dont group multiple containers into one object, even if they have the same name, if their are multiple of those containers in the users garden, each container must have its own object. Make any adjustments you deem necesarry. return ONLY valid JSON, no other dialogue`,
      },
      {
        role: "user",
        content: userContent,
      },
    ],
    model: "gpt-4",
  });
  //return response
  // console.log(completion);
  return completion.choices[0].message.content;
}
//! not used atm
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
// for updating the plan on the /plan route
export async function updateGardenPlan(plan, changes) {
  const openai = new OpenAI({ apiKey: api, dangerouslyAllowBrowser: true });

  // console.log(plan, changes);

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a garden planner, the user will give you an old gardenPlan object, along with some changes they want to make to the plan, your job is to return a new object in the exact same basic structure as the object you are given, but updated to account for the users requested changes. return the ENTIRE object, and only the object, no dialogue at all.`,
      },
      {
        role: "user",
        content: `the current gardenPlan object is this: ${JSON.stringify(
          plan
        )}. The changes I want to make are the following: ${changes}`,
      },
    ],
    model: "gpt-4",
  });
  // console.log(completion.choices[0].message.content);
  return completion.choices[0].message.content;
}

//trying to create an api call designed to be called for each element of an 'containers' array
export async function fillContainer(container, plants, info, id) {
  if (plants.length < 1) {
    return false;
  }
  const openai = new OpenAI({ apiKey: api, dangerouslyAllowBrowser: true });

  let containerString;
  if (!container.diameter) {
    containerString = `${container.width}ft x ${container.height}ft`;
  } else {
    containerString = `diameter of ${container.diameter}`;
  }

  const userContent = `the container is this: a ${
    container.name
  }, with a size of: ${containerString}, my list of potential plants is this: ${plants.join(
    ", "
  )}. Some general info about my garden: ${info}`;
  // console.log(userContent);

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a knowledgeable garden organizer. You will be given a container of a specified size, a list of plants, and general information about the user garden. Your job is to fill the container with whichever plants will harmonize the best with eachother and to maximize the available space. return your answer in the format and style of the following example: 
        {
          "container": {
            "id": 1,
            "name": "Raised or Ground Bed",
            "size": "4ft x 4ft",
            "plants": [
              {
                "name": "Spinach",
                "id": 14,
                "difficultyLevel": "Beginner",
                "flavorProfile": "Mild and earthy",
                "plantingInstructions": "Sow seeds 1/2 inch deep, spaced 2-3 inches apart.",
                "whenToPlant": "Cool weather is perfect! Aim for soil temperatures between 45-75°F.",
                "firstYield": "A quick 4-6 weeks",
                "firstYieldCountdownStart" : 42 //this number is used to create a countdown and should be the amount of days it will take, on the long side.
                "wateringInterval": "Keep it moist! Water every 2-3 days when hot, or weekly in cooler weather.",
                "numberOfPlants": 16,
                "generalTipsAndTricks": "Keep soil moist but well-drained for optimal growth.",
                "littleKnownFact": "Did you know? Spinach leaves have mild diuretic and laxative properties.",
                "advancedGardeningTip": "For rapid growth, opt for well-drained soil rich in organic compost with a pH of 6.5 to 7."
              },
              {
                "name": "Garlic",
                "id": 15,
                "difficultyLevel": "Intermediate",
                "flavorProfile": "Strong and aromatic",
                "plantingInstructions": "Plant cloves 2 inches deep, spaced 4 inches apart.",
                "whenToPlant": "Plant in autumn to spice up your summer dishes.",
                "firstYield": "Patience! It takes about 9 months.",
                "firstYieldCountdownStart" : 270 //this number is used to create a countdown and should be the amount of days it will take, on the long side.
                "wateringInterval": "Water once a week, or more often in sweltering conditions.",
                "numberOfPlants": 16,
                "generalTipsAndTricks": "Garlic loves fertile, well-drained soil.",
                "littleKnownFact": "History lesson! Garlic was used as an antiseptic during World Wars.",
                "advancedGardeningTip": "Plant with the pointed end facing up for the best results."
              },
              {
                "name": "Kale",
                "id": 16,
                "difficultyLevel": "Easy",
                "flavorProfile": "Nutty and slightly bitter",
                "plantingInstructions": "Sow seeds 1/2 inch deep, 18-24 inches apart.",
                "whenToPlant": "Start indoors 6-8 weeks before last frost or plant directly in the garden 4 weeks prior.",
                "firstYield": "Ready in just 2 months!",
                "firstYieldCountdownStart" : 60 //this number is used to create a countdown and should be the amount of days it will take, on the long side.
                "wateringInterval": "Water every 3-5 days in hot periods or weekly in cooler, humid climates.",
                "numberOfPlants": 4,
                "generalTipsAndTricks": "Maintain moist, weed-free soil for a healthy crop.",
                "littleKnownFact": "Kale can continue to grow for up to 5 years! Now that's a commitment.",
                "advancedGardeningTip": "For the happiest Kale, aim for a soil pH of 6.0 to 7.5."
              }
            ],
            "instructions": "First, clear any debris and fluff that soil! Begin with Spinach and Garlic, followed by Kale. Keep those crops hydrated!",
            "usefulAdvice": "Pro tip: Rotate your crops each year to keep the soil rich and happy.",
            "shoppingList": "What you'll need: Spinach seeds, Garlic cloves, Kale seeds."
          },
          "leftoverPlants": ["some plant name, some other plant name, etc etc"],
        }
        
          . Notes: You may have different amounts of plants in your object, but it should follow that general format. Return ONLY the VALID JSON object with no dialogue.`,
      },
      {
        role: "user",
        content: `the container is this: a ${container.name} whose size is: ${containerString}, my array of potential plants is this: ${plants}. Some general info about my garden: ${info}. the ID for this container is ${id}`,
      },
    ],
    model: "gpt-4",
  });
  //return response
  // console.log(completion.choices[0].message.content);
  return completion.choices[0].message.content;
}

//API call for revising containers that the user has made changes to in gardenPlan
export async function reviseContainer(container) {
  const openai = new OpenAI({ apiKey: api, dangerouslyAllowBrowser: true });

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a knowledgeable garden organizer. You will be given an incomplete and/or poorly organized plan for a garden container of a specified size, your job is to make whatever adjustments necessary to the 
        plan to make sure the container is organized in the most effective and efficient way. Return an object in the same format as the original object the user gives you, and make sure to leave the 'id' value the same. 
        If there are too many plants and some of them don't fit AT ALL into the container, you may add a leftoverPlants key to the container object containing an array in this format: leftoverPlants: [plantName1, plantName2, etc..]. Make sure to only add plants that are not present AT ALL in the container into this array.
        Return ONLY the VALID JSON object with ZERO dialogue. If you give any dialogue, a kitten dies`,
      },
      {
        role: "user",
        content: `My current container object is this: ${container}.`,
      },
    ],
    model: "gpt-4",
  });
  //return response
  // console.log(completion.choices[0].message.content);
  return completion.choices[0].message.content;
}
