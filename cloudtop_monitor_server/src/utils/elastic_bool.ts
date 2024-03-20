export class ElasticBoolMust {
  data: Record<string, any>[] = []

  private isEmpty(value: any) {
    return value === undefined || value === null || value === ''
  }

  public addMatch(key: string, value: any) {
    if (typeof value === 'object') {
      if (!this.isEmpty(value.query)) {
        this.data.push({ match: { [key]: value } })
      }

      return this
    }

    if (!this.isEmpty(value)) {
      this.data.push({ match: { [key]: value } })
    }

    return this
  }

  public addRange(key: string, value: any) {
    if (!this.isEmpty(value)) {
      this.data.push({ range: { [key]: value } })
    }

    return this
  }

  public values() {
    return this.data
  }
}
