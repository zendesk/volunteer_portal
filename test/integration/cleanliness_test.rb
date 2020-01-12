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
        app/graphql/mutations/base_mutation.rb
        app/graphql/mutations/create_event_type.rb
        app/graphql/mutations/approve_individual_events.rb
        app/graphql/mutations/create_signup.rb
        app/graphql/mutations/delete_individual_event.rb
        app/graphql/mutations/update_user.rb
        app/graphql/mutations/delete_organization.rb
        app/graphql/mutations/destroy_signup.rb
        app/graphql/mutations/create_organization.rb
        app/graphql/mutations/create_office.rb
        app/graphql/mutations/update_organization.rb
        app/graphql/mutations/reject_individual_events.rb
        app/graphql/mutations/update_office.rb
        app/graphql/mutations/delete_user.rb
        app/graphql/mutations/create_edit_individual_event.rb
        app/graphql/mutations/delete_event_type.rb
        app/graphql/mutations/create_event.rb
        app/graphql/mutations/delete_event.rb
        app/graphql/mutations/delete_office.rb
        app/graphql/mutations/update_event_type.rb
        app/graphql/mutations/update_event.rb
        app/graphql/mutations/update_user_office.rb
        app/graphql/mutations/delete_tag.rb
        app/graphql/mutations/create_tag.rb
        app/graphql/mutations/confirm_profile_settings.rb
        app/graphql/portal_schema.rb
        app/graphql/resolvers/office_resolver.rb
        app/graphql/resolvers/organization_resolver.rb
        app/graphql/types/base_interface.rb
        app/graphql/types/base_object.rb
        app/graphql/types/base_scalar.rb
        app/graphql/types/base_union.rb
        app/graphql/types/datetime_type.rb
        app/graphql/types/enum/base_enum.rb
        app/graphql/types/enum/event_sort_enum.rb
        app/graphql/types/enum/individual_event_status_enum.rb
        app/graphql/types/enum/office_sort_enum.rb
        app/graphql/types/enum/user_sort_enum.rb
        app/graphql/types/event_graph_type.rb
        app/graphql/types/event_type_graph_type.rb
        app/graphql/types/individual_event_graph_type.rb
        app/graphql/types/input/association_input_type.rb
        app/graphql/types/input/base_input_object.rb
        app/graphql/types/input/create_edit_individual_event_input_type.rb
        app/graphql/types/input/delete_individual_event_input_type.rb
        app/graphql/types/input/edit_event_input_type.rb
        app/graphql/types/input/edit_event_type_input_type.rb
        app/graphql/types/input/edit_office_input_type.rb
        app/graphql/types/input/edit_organization_input_type.rb
        app/graphql/types/input/edit_user_input_type.rb
        app/graphql/types/input/edit_tag_input_type.rb
        app/graphql/types/mutation_type.rb
        app/graphql/types/office_graph_type.rb
        app/graphql/types/organization_graph_type.rb
        app/graphql/types/query_type.rb
        app/graphql/types/role_graph_type.rb
        app/graphql/types/signup_graph_type.rb
        app/graphql/types/user_graph_type.rb
        app/graphql/types/tag_graph_type.rb
        app/graphql/types/user_preference_graph_type.rb
        app/helpers/application_helper.rb
      ]
    )
  end
end
