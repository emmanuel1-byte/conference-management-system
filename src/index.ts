import app from './app'

const port  = process.env.PORT  || 2000

app.listen(port, ()=>{
    console.clear()
    console.log(`Backend server is listening on port ${port}`)
})