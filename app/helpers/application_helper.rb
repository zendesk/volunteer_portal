module ApplicationHelper
  def available_months
    Event.connection.select_all('select extract(YEAR from time) as year from events group by year').rows.flatten
  end

  def nice_provider_name(provider)
    case provider
    when :google_oauth2 then "Google"
    else provider.to_s.titleize
    end
  end
end
