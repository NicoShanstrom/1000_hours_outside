module ApplicationHelper
  def flash_class_for(type)
    case type.to_sym
    when :notice then "alert alert-success"
    when :alert then "alert alert-danger"
    when :error then "alert alert-danger"
    when :warning then "alert alert-warning"
    else "alert alert-info"
    end
  end
end
