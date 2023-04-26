import fs from 'node:fs'
import process from 'node:process'
const subcommand = process.argv[2]
const title = process.argv[1]
if (title === 'petshop.js' && subcommand === undefined) {
    console.log(
        'WELCOME TO THE PETSHOP PLEASE USE THE FOLLOWING COMMANDS:\nnode [read | create | update | destroy]'
    )
}
if (subcommand === 'read') {
    const petIndex = process.argv[3]
    fs.readFile('pets.json', 'utf8', (err, data) => {
        if (err) {
            throw err
        }
        const pets = JSON.parse(data)
        if (
            petIndex === undefined ||
            petIndex.includes('-') ||
            isNaN(petIndex)
        ) {
            console.log(pets)
        } else {
            console.log(pets[petIndex])
        }
    })
} else if (subcommand === 'create') {
    if (
        !isNaN(process.argv[3]) &&
        process.argv[4] !== undefined &&
        process.argv[5] !== undefined
    ) {
        // console.log('Please type AGE TYPE NAME')
        let petAge = { age: Number(`${process.argv[3]}`) }
        let petKind = { kind: `${process.argv[4]}` }
        let petName = { name: `${process.argv[5]}` }
        let newPet = Object.assign({}, petAge, petKind, petName)
        // console.log(JSON.stringify(newPet))
        //you need to filesync to get to old data
        let data = fs.readFileSync('pets.json')
        //parsing the data to turn into objects/arr to use .push
        let myPet = JSON.parse(data)
        myPet.push(newPet)
        //back to string becase the original data is a string
        let newData = JSON.stringify(myPet)
        // console.log(newData)
        fs.writeFile('pets.json', newData, (err) => {
            if (err) throw err
            console.log('New Pet Added!')
        })
    } else {
        console.log(
            'SOMETHING SEEMS WRONG! PLEASE TYPE: \nnode pets.js create AGE KIND NAME'
        )
    }
    //repeating step above with minor adjustments
} else if (subcommand === 'update') {
    const petIndex = process.argv[3]
    fs.readFile('pets.json', 'utf8', (err, data) => {
        if (err) {
            throw err
        }
        const pets = JSON.parse(data)
        if (
            petIndex === undefined ||
            petIndex.includes('-') ||
            isNaN(petIndex)
        ) {
            console.log('not a valid index!')
        } else if (
            //need to update index since they all moved up by one since we are CALLING the index of the animal that will be changed
            !isNaN(process.argv[4]) &&
            process.argv[5] !== undefined &&
            process.argv[6] !== undefined
        ) {
            //tried with delete only but kept a NULL value after i deleted the obj from arr
            let petToBeChanged = delete pets[petIndex]
            let petAge = { age: Number(`${process.argv[4]}`) }
            let petKind = { kind: `${process.argv[5]}` }
            let petName = { name: `${process.argv[6]}` }
            let newPet = Object.assign({}, petAge, petKind, petName)
            petToBeChanged = newPet
            pets.push(petToBeChanged)
            //used filter to remove null because of the delete feature above
            let pets1 = pets.filter((elements) => {
                return elements !== null
            })
            let petUpdate = JSON.stringify(pets1)
            fs.writeFile('pets.json', petUpdate, (err) => {
                if (err) throw err
                console.log('Your Pet is Updated!')
            })
        } else {
            console.log(
                'SOMETHING SEEMS WRONG! PLEASE TYPE: \nnode pets.js update INDEX AGE KIND NAME'
            )
        }
    })
} else if (subcommand === 'destroy') {
    const petIndex = process.argv[3]
    fs.readFile('pets.json', 'utf8', (err, data) => {
        if (err) {
            throw err
        }
        const pets = JSON.parse(data)
        if (
            petIndex === undefined ||
            petIndex.includes('-') ||
            isNaN(petIndex)
        ) {
            console.log(
                'THERE IS NO ANIMAL HERE FOR YOU TO DESTROY...\nTRY ANOTHER INDEX'
            )
            //need there to be a condition to be set if there is NO pet to be index/destroyed
        } else if (pets[petIndex] !== undefined) {
            //tried with delete only but kept a NULL value after i deleted the obj from arr
            let petToBeChanged = delete pets[petIndex]
            pets.push(petToBeChanged)
            //used filter to remove null because of the delete feature above
            let pets1 = pets.filter((elements) => {
                return elements !== null && elements !== true
            })
            let petUpdate = JSON.stringify(pets1)
            fs.writeFile('pets.json', petUpdate, (err) => {
                if (err) throw err
                console.log('Your Pet Has Been DESTROYED!')
            })
        } else {
            console.log(
                'THERE IS NO ANIMAL HERE FOR YOU TO DESTROY...\nTRY ANOTHER INDEX'
            )
        }
    })
}
