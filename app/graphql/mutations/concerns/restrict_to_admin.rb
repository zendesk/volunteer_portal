module Mutations::Concerns
  module RestrictToAdmin
    def ready?(*)
      if context[:current_user].role == Role.admin
        true
      else
        raise PortalSchema::MutationForbiddenError
      end
    end
  end
end
