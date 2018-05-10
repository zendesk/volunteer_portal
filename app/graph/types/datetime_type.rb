DatetimeType = GraphQL::ScalarType.define do
  name 'Datetime'
  description 'UTC Timestamp in ISO8601 format'

  coerce_input ->(value, ctx) { Time.parse(value) }
  coerce_result ->(value, ctx) { value.utc.iso8601 }
end
