namespace :graphql do
  desc "Generates the GraphQL schema introspection for relay"
  task generate_schema: :environment do
    path = 'app/assets/javascripts/graphql_schema.json'
    schema = VolunteerSchema.execute(GraphQL::Introspection::INTROSPECTION_QUERY)

    File.open(Rails.root + path, 'w') do |f|
      f.write(JSON.pretty_generate(schema))
      puts "Wrote GraphQL schema to #{path}"
    end
  end
end
