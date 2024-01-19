//function for the original problem
function waterQueue(waterBottles, numberOfTaps){
    try {
        validate(waterBottles, numberOfTaps)   //Validate the inputs so that the input type is correct (bonus question 1)

        let flowRate = 100
        var totalTime = 0
        var taps = []
        let minTime
        let maxTime

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
                    taps[i].timeTaken(minTime)
                    maxTime = taps[i].waitTime //save the max time for when the queue is finished, but there are still remaining people using the taps
                }
            }
        } 
        totalTime = totalTime + maxTime //add the time needed for the remaining people on the taps
        return console.log(totalTime);
    } catch (error) {
        console.log(error)
        return true
    }

    
}

function validate(water_bottles, taps){
    if (!Array.isArray(water_bottles) || !Number.isInteger(taps)){  //if the water bottle is not array or the number of taps is not in integer, it will throw an error
        throw new Error("Input type is invalid")
    } else{
        water_bottles.forEach(volume => {       // if the array of water bottles is not an array of integer it will throw an error
            if (!Number.isInteger(volume)) throw new Error ("Water bottle volume has to be an integer")
        })
    }
}

class waterTap{
    constructor(flowRate){
        this.flowRate = flowRate
        this.time = 0
        this.taken = false
    }

    get waitTime(){
        return this.time
    }

    get status(){
        return this.taken
    }

    useTap(volume){
        this.time = volume/this.flowRate
        this.taken = true
    }

    timeTaken(time){
        this.time = this.time - time
        if (this.time === 0){
            this.taken = false
        }
    }
}

waterQueue([1000, 200, 3000, 1500, 450, 250], 2)