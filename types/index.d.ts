type SetStateAction<T> = React.Dispatch<React.SetStateAction<T>>

interface HttpError {
  title: string
  description: string
}

interface Statistics {
  name: string
  times: number
}
