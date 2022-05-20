const {parse} = require('csv-parse')

const fs = require('fs')

const getData = () => {
    const data = []
    return new Promise((resolve, reject) => {
        fs.createReadStream('./data.csv')
            .pipe(parse({
                delimiter: ','
            }))
            .on('data', (row) => {
                data.push(row)
            }).on('end', () => {
            resolve(data)
        })
    })

}
function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

const getData2 = async () => {
    const data =  await getData()
    const blocks = []
    for (let i = 1; i < data.length; i++) {
        let string = data[i][3]
        let blockNo = string.slice(string.indexOf('-') - 1, string.indexOf('-') + 5)
        if (!isNumeric(blockNo.charAt(blockNo.length - 1))) {
            blockNo = blockNo.slice(0, blockNo.length - 1)
        }
        if (blockNo !== '') {
            blockNo = blockNo.replace('-', '')
            blockNo = blockNo.charAt(0).toUpperCase() + blockNo.slice(1)
            // console.log(blockNo)
            blocks.push(blockNo)
        }
    }
    let res = '['
    // console.log('[')
    for (let i = 0; i < blocks.length; i++) {
        res += "'" + blocks[i] + "',"
    }
    res += ']'
    console.log(res)
    // console.log(data.length)
    // console.log(blocks.length)
    // blocks.forEach(i => console.log(i))
    // console.log(blocks)
    // console.log(data[1][3])
}

getData2()

