class StandaloneController < ApplicationController
  layout 'portal'

  def portal
    respond_to do |f|
      f.any { render "portal.html.erb" }
    end
  end
end
