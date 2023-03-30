import { Application, Router } from 'express'
import { AuthRouter } from './auth.route'
import { HealthRouter } from './health.route'
import { ProductRouter } from './product.route'

const _routes: Array<[string, Router]> = [
  ['/', HealthRouter],
  ['/product', ProductRouter],
  ['/auth', AuthRouter]
]

export const routes = (app: Application) => {
  _routes.forEach((route) => {
    const [url, router] = route
    app.use(url, router)
  })
}
