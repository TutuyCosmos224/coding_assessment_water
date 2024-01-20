/** 
  CODING ASSESSMENT FOR WSD HK TECHNICAL CONSULTANT POSITION
  BY HANSEN EMANUEL

  HOW TO RUN THE PROGRAM

  PRE-REQUISITE: MAKE SURE YOU HAVE NODE INSTALLED IN YOUR DEVICE, AND SET AS PATH IN THE ENVIRONMENT VARIABLES

  1. CONVERT THE FILE INTO A JAVASCRIPT (.JS) FILE
  2. OPEN TERMINAL
  3. CD TO THE FILE DIRECTORY
  4. RUN THIS COMMAND IN TERMINAL: `node -e 'require(./water_queue.js).< function name here >(< input here >)`

  e.g. node -e 'require("./water_queue.js").waterQueueWalkTime([1000, 200, 3000, 1500, 450, 250], 2, 3)' 
  

  FUNCTION NAME:
  waterQueue( waterBottles, numberOfTaps ) --> original problem
  waterQueueWalkTime( waterBottles, numberOfTaps, timeToTap ) --> also consider that there is time to walk to the Tap (Bonus Question 2)
  waterQueueDiffTap ( waterBottles, waterTaps ) -->  also consider that the flow rate of each tap is different  (Bonus Question 3)

  type of input:
  1. waterBottles: Integer[] / Array of Positive Integer
  2. numberOfTaps: Integer / Positive Integer
  3. timeToTap: Integer / Positive Integer
  4. waterTaps: Integer[] / Array of Positive Integer
 
  NOTE:: BONUS QUESTION 4 IS AT THE END OF THE FILE (AFTER MODULE.EXPORTS)
*/

//function for the original problem
function waterQueue(waterBottles, numberOfTaps){ 
    try {
        validate(waterBottles, numberOfTaps, 1)   //Validate the inputs so that the input type is correct (bonus question 1)

        let flowRate = 100
        var totalTime = 0
        var taps = []
        var minTime
        var maxTime = 0

        //generate the taps
        for (let i = 0; i < numberOfTaps; i++){
            taps.push(new waterTap(flowRate))
        }

        // iterate through the queue of water bottles
        while (waterBottles.length != 0 ){
            firstInLine = waterBottles[0]
            let needToWait = true

            //check for available tap, if there is one available --> tag it as unavailable, set the volume of the bottle it's filling, and break the loop
            for (let i = 0; i < numberOfTaps; i++){
                if (taps[i].status === false){
                    taps[i].useTap(firstInLine)
                    needToWait = false
                    waterBottles.shift()
                    break
                }
            }

            //if all the taps are full, we look at the taps with the least time left to fill the bottle, then add that time to the total time and make the tap available for next person in line
            if (needToWait === true){
                for (let i = 0; i < numberOfTaps; i++){
                    if (!minTime || taps[i].waitTime<minTime){
                        minTime = taps[i].waitTime
                    }
                }

                totalTime = totalTime + minTime

                for (let i = 0; i < numberOfTaps; i++){
                    taps[i].timeTaken(minTime)  //reduce all the time left in the taps with the time remaining of the taps with the least ime left
                }

                minTime = null //reset minTime as it is only used to compare the smallest time needed in each iteration
            }
        } 
        for (let i = 0; i < numberOfTaps; i++){
            if (taps[i].waitTime>maxTime){
                maxTime = taps[i].waitTime //save the max time for when the queue is finished, but there are still remaining people using the taps
            }
        }

        totalTime = totalTime + maxTime //add the time needed for the remaining people on the taps
        return console.log(totalTime);
    } catch (error) {
        console.log(error)
        return true
    }    
}

//function for bonus question number 2, where we assume people spend some time to walk to the tap
function waterQueueWalkTime(waterBottles, numberOfTaps, timeToTap){
    try {
        validate(waterBottles, numberOfTaps, 2, timeToTap)   

        let flowRate = 100
        var totalTime = 0
        var taps = []
        var minTime
        var maxTime = 0

        for (let i = 0; i < numberOfTaps; i++){
            taps.push(new waterTap(flowRate, timeToTap))
        }

        while (waterBottles.length != 0 ){
            firstInLine = waterBottles[0]
            let needToWait = true

            for (let i = 0; i < numberOfTaps; i++){
                if (taps[i].status === false){
                    taps[i].useTap(firstInLine)
                    needToWait = false
                    waterBottles.shift()
                    break
                }
            }

            if (needToWait === true){
                for (let i = 0; i < numberOfTaps; i++){
                    if (!minTime || taps[i].waitTime<minTime){
                        minTime = taps[i].waitTime
                    }
                }

                totalTime = totalTime + minTime
                

                for (let i = 0; i < numberOfTaps; i++){
                    taps[i].timeTaken(minTime)
                }

                minTime = null
            }
        } 

        for (let i = 0; i < numberOfTaps; i++){
            if (taps[i].waitTime>maxTime){
                maxTime = taps[i].waitTime 
            }
        }
        totalTime = totalTime + maxTime 
        return console.log(totalTime);
    } catch (error) {
        console.log(error)
        return true
    } 
}

//function for bonus question number 3, where we assume that each tap have different flow rates
function waterQueueDiffTap(waterBottles, waterTaps){
    try {
        validate(waterBottles, waterTaps, 3)   

        var totalTime = 0
        var taps = []
        var minTime
        var maxTime = 0

        waterTaps.forEach( flowRate =>{
            taps.push(new waterTap(flowRate))
        })

        while (waterBottles.length != 0 ){
            firstInLine = waterBottles[0]
            let needToWait = true

            for (let i = 0; i < taps.length; i++){
                if (taps[i].status === false){
                    taps[i].useTap(firstInLine)
                    needToWait = false
                    waterBottles.shift()
                    break
                }
            }

            if (needToWait === true){
                for (let i = 0; i < taps.length; i++){
                    if (!minTime || taps[i].waitTime<minTime){
                        minTime = taps[i].waitTime
                    }
                }

                totalTime = totalTime + minTime

                for (let i = 0; i < taps.length; i++){
                    taps[i].timeTaken(minTime)
                }

                minTime = null
            }
        } 

        for (let i = 0; i < taps.length; i++){
            if (taps[i].waitTime>maxTime){
                maxTime = taps[i].waitTime 
            }
        }
        totalTime = totalTime + maxTime  
        return console.log(totalTime);
    } catch (error) {
        console.log(error)
        return true
    }
}

//function to validate the input
function validate(waterBottles, taps, problemNum, walkTime){
    switch (problemNum){
        //validate input for the original problem
        case 1:
            if (!Array.isArray(waterBottles) || !Number.isInteger(taps)){  //if the water bottle is not array or the number of taps is not in integer, it will throw an error. We assume an empty array as no water bottle in queue (0 water bottle)
                throw new Error("Input type is invalid")
            } else{
                waterBottles.forEach(volume => {       // if the array of water bottles is not an array of integer it will throw an error
                    if (!Number.isInteger(volume) || volume <= 0) throw new Error ("Water bottle volume has to be a positive integer")
                })
                
                if (taps <= 0) throw new Error("Number of taps have to be a positive integer") //number of taps have to be positive, if not the problem is not valid.
            }
            break

        //validate input for bonus question 2
        case 2:
            if (!Array.isArray(waterBottles) || !Number.isInteger(taps) || !Number.isInteger(walkTime)){  
                throw new Error("Input type is invalid")
            } else{
                if (walkTime < 0) throw new Error ("Walk time have to be a positive integer!") //validation for the time to walk input

                waterBottles.forEach(volume => {      
                    if (!Number.isInteger(volume) || volume <= 0) throw new Error ("Water bottle volume has to be a positive integer")
                })

                if (taps <= 0) throw new Error("Number of taps have to be a positive integer")
            }
            break
        
        //validate input for bonus question 3
        case 3:
            if (!Array.isArray(waterBottles) || !Array.isArray(taps)){ 
                throw new Error("Input type is invalid")
            } else{
                if (taps.length <= 0) throw new Error("There have to be more than 0 of taps")

                waterBottles.forEach(volume => {       
                    if (!Number.isInteger(volume) || volume <= 0) throw new Error ("Water bottle volume has to be a positive integer")
                })
                taps.forEach(flowRate =>{
                    if (!Number.isInteger(flowRate) || flowRate <= 0) throw new Error ("The flowrates of the taps has to be a positive integer")
                })
            }
            break
    }
}

class waterTap{  //A class to simulate the water tap
    constructor(flowRate, walkTime){
        this.flowRate = flowRate
        this.time = 0
        this.taken = false
        this.walkTime = walkTime || 0       //if there is no walkTime input, then the walkTime will be 0 (for other problems outside bonus question 2)
    }

    get waitTime(){
        return this.time
    }

    get status(){
        return this.taken
    }

    useTap(volume){     //Mark that the tap is currently in use. It takes the volume of the bottle, and immediately calculate the time taken to fill the bottle
        this.time = (volume/this.flowRate) + this.walkTime
        this.taken = true
    }

    timeTaken(time){    //Function to reduce the time left on the tap
        this.time = this.time - time
        if (this.time === 0){
            this.taken = false  //if the time is 0, then the tap is no longer occupied
        }
    }
}

module.exports = { waterQueue, waterQueueDiffTap, waterQueueWalkTime }

/**BONUS QUESTION 4
  Yes, it is possible that the time taken to fill all of the bottle increase when we increase at lease one of the flow rate of the tap
  
  One example is this input:
  waterQueueDiffTap([1000, 200, 3000, 1500, 450, 250, 3000, 5000, 10000, 2000], [200, 100, 100]) --> 73.5
  
  AND
  
  waterQueueDiffTap([1000, 200, 3000, 1500, 450, 250, 3000, 5000, 10000, 2000], [200, 100, 200]) --> 117 
  
  where even though the second input have higher flow rate on one of the tap, the time taken to fill all the bottle increases (from 73.5 to 117).
  This happens because when we change the flowrate of one of the tap, it may change the order of the taps used by each person in the line.
  From the above example, when we change the order, when previously the biggest bottle (10000) was filled with the 200 tap, when we increase
  the flow rate of the last tap, the order change, causing the biggest bottle to be filled with the 100 tap, which increase the time taken to fill the tap
 */