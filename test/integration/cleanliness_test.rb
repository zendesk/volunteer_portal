require_relative '../test_helper'

SingleCov.not_covered!

describe 'cleanliness' do
  it "has coverage for all tests" do
    # option :tests to pass custom Dir.glob results
    SingleCov.assert_used
  end

  it "has tests for all files" do
    # option :tests and :files to pass custom Dir.glob results
    # :untested to get it passing with known untested files
    SingleCov.assert_tested(
      untested: %w[
        app/channels/application_cable/channel.rb
        app/channels/application_cable/connection.rb
        app/channels/events_channel.rb
        app/channels/signups_channel.rb
        app/controllers/application_controller.rb
        app/controllers/graphql_controller.rb
        app/controllers/omniauth_callbacks_controller.rb
        app/controllers/ping_controller.rb
        app/controllers/standalone_controller.rb
        app/graph/resolvers/office_resolver.rb
        app/graph/resolvers/organization_resolver.rb
        app/graph/types/datetime_type.rb
        app/graph/types/event_graph_type.rb
        app/graph/types/event_type_graph_type.rb
        app/graph/types/individual_event_graph_type.rb
        app/graph/types/mutation_graph_type.rb
        app/graph/types/office_graph_type.rb
        app/graph/types/organization_graph_type.rb
        app/graph/types/query_graph_type.rb
        app/graph/types/role_graph_type.rb
        app/graph/types/signup_graph_type.rb
        app/graph/types/user_graph_type.rb
        app/graph/volunteer_schema.rb
        app/helpers/application_helper.rb
      ]
    )
  end
end
