const {createConnection}=require('mysql2')
const inquirer=require('inquirer')
 require('dotenv').config()
 let pass=process.env.mysql_password
 let data
const db=createConnection({
    host:'localhost',
    user:'root',
    password:pass,
    database:'bamazon'
})
db.connect(e=>{
    if(e){console.log(e)}
    else{
       getorder()
}
})

async function check_stock(id,quantity,data){
    console.log(`there are ${data[parseInt(id)].stock_quantity} ${data[parseInt(id)].product_name}s left`)
    const check=await new Promise((resolve,reject)=>{
        
        if (parseInt(id)<=data[data.length-1].item_id)
           { 
               if(data[parseInt(id)].stock_quantity>parseInt(quantity))
                    {
                        db.query(`UPDATE products SET? WHERE?`,[{stock_quantity:data[id].stock_quantity-quantity},{item_id:id}],(e,r)=>{
                            if(e){
                                console.log(e)
                                reject()
                            }
                            else{
                                console.log(`the order placed, the total price is ${parseInt(quantity)*parseInt(data[parseInt(id)].price)}`)
                                console.log(`the price for each single item is ${data[parseInt(id)].price}`)
                                inquirer.prompt([{type:'input',
                                name:'restart',
                                message:'do you want to restart ordering? Y/N'}
                               ])
                               .then(({restart})=>
                               {
                                if(restart==='Y')
                                    getorder()
                                else db.end() })
                               .catch(e=>console.error(e))
                                resolve()
                            }
                        })
                    }
                    else{
                        console.log(`There are not enough items in the stock`)
                        reject()
                    }
                }

    })
}
const getorder=_=>{

    db.query('SELECT *FROM products',(e,data)=>{
        if(e){console.log(e)}
        else{data.forEach(elem=>{
            console.log('---------')
            console.log(`id:${elem.item_id}`)
            console.log(`name:${elem.product_name}`)
            console.log(`department:${elem.department_name}`)
            console.log(`price:${elem.price}`)

        })
    inquirer.prompt([{type:'input',
                        name:'product_id',
                        message:'Insert the Id of the idem you would like to purchase'},
                        {type:'input',
                        name:'quantity',
                        message:'Insert how many of that item you would like to purchase '}])
        // check_stock()
        .then(({product_id,quantity})=>{
            
            check_stock(product_id,quantity,data)
            
        })
        .catch(e=>console.error(e))
    
    }
    })
}