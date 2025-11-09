import app from './app'
import seed from './seed'

seed()

app.listen(3000, () => {
  console.log('Server running on port 3000')
})