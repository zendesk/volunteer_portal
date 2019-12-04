class Rack::Attack

  safelist('allow connections from certain locations') do |req|
    safelist = ENV['IP_SAFE_LIST'] || ''
    safelist.split(',').include?(req.ip)
  end

  blocklist('block everything else') do |req|
    ENV['IP_BLOCK_ALL'] == 'true'
  end

end

Rack::Attack.blocklisted_response = lambda do |env|
  [ 403, {}, [ENV['IP_BLOCK_MESSAGE'] || 'Forbidden']]
end
