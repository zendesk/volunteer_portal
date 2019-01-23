module OrganizationResolver
    class << self
      def create(_, args, context)
        organization = Organization.new(args[:input].to_h)
        organization.save!

        organization
      end

      def update(_, args, context)
        organization = Organization.find(args[:input].id)
        organization.update_attributes!(args[:input].to_h.except(:id))

        organization
      end

      def delete(_, args, context)
        organization = Organization.find(args[:id])
        organization.destroy!

        organization
      end
    end
  end
