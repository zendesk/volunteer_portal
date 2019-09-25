module Mutations::Concerns
  module RestrictToAdmin
    def ready?(*)
      raise PortalSchema::MutationForbiddenError unless context[:current_user].role == Role.admin

      true
    end
  end
end
