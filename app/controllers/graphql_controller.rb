class GraphqlController < ApplicationController
  skip_before_action :verify_authenticity_token

  rescue_from 'ActiveRecord::RecordInvalid' do |exception|
    exception.record.errors.messages
    render json: {
      errors: exception.record.errors,
    }
  end

  def create
    query_string = params[:query]
    query_variables = params[:variables] || {}
    query_context = { current_user: current_user }

    query = GraphQL::Query.new(::VolunteerSchema, query_string, variables: query_variables, context: query_context)

    render json: query.result
  end
end
