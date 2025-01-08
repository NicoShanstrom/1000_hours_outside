# Be sure to restart your server when you modify this file.

# Define an application-wide content security policy.
# See the Securing Rails Applications Guide for more information:
# https://guides.rubyonrails.org/security.html#content-security-policy-header

Rails.application.configure do
  config.content_security_policy do |policy|
    policy.default_src :self, :https
    policy.font_src    :self, :https, :data
    policy.img_src     :self, :https, :data
    policy.object_src  :none
    # Use a safe fallback if `content_security_policy_nonce` isn't available
    policy.script_src  :self, :https, -> {
      if respond_to?(:request) && request.respond_to?(:content_security_policy_nonce)
        "'nonce-#{request.content_security_policy_nonce}'"
      else
        "'self'"
      end
    }
    policy.style_src   :self, :https, :unsafe_inline
  end

  # Enable nonce generation with a fallback
  config.content_security_policy_nonce_generator = ->(req) { SecureRandom.base64(16) if req.respond_to?(:content_security_policy_nonce) }
  config.content_security_policy_nonce_directives = %w(script-src)
end

