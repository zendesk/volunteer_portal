class GraphqlController < ApplicationController
  skip_before_action :verify_authenticity_token

  def execute
    render json: PortalSchema.execute(
      params[:query],
      variables: variables,
      context: context,
      operation_name: params[:operationName]
    )
  rescue ActiveRecord::RecordNotFound => e
    handle_record_not_found(e)
  rescue PortalSchema::MutationForbiddenError
    handle_forbidden_mutation
  rescue StandardError => e
    raise e unless Rails.env.development?

    handle_error_in_development(e)
  end

  private

  def variables
    ensure_hash(params[:variables])
  end

  def context
    {
      current_user: current_user
    }
  end

  # Handle form data, JSON body, or a blank value
  def ensure_hash(ambiguous_param)
    case ambiguous_param
    when String
      if ambiguous_param.present?
        ensure_hash(JSON.parse(ambiguous_param))
      else
        {}
      end
    when Hash, ActionController::Parameters
      ambiguous_param
    when nil
      {}
    else
      raise ArgumentError, "Unexpected parameter: #{ambiguous_param}"
    end
  end

  def handle_record_not_found(exception)
    render json: {
      errors: [
        { message: exception.message }
      ]
    }, status: :not_found
  end

  def handle_error_in_development(e)
    logger.error e.message
    logger.error e.backtrace.join("\n")

    render json: { error: { message: e.message, backtrace: e.backtrace }, data: {} }, status: 500
  end

  def handle_forbidden_mutation
    render json: {
      errors: [
        { message: "You don't have permission to do this" }
      ]
    }, status: :forbidden
  end
end
