import React, { useState } from 'react';
import { Heart, Diamond, Award, Users, Clock, Star, Gem, Shield, Gift } from 'lucide-react';
import './AboutPage.scss';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('story');

  const stats = [
    { number: '15+', label: 'Năm Kinh Nghiệm', icon: Clock },
    { number: '50,000+', label: 'Khách Hàng Tin Tưởng', icon: Users },
    { number: '100+', label: 'Thiết Kế Độc Quyền', icon: Diamond },
    { number: '99%', label: 'Khách Hàng Hài Lòng', icon: Star }
  ];

  const values = [
    {
      icon: Diamond,
      title: 'Chất Lượng Vượt Trội',
      description: 'Chỉ sử dụng kim cương và đá quý thiên nhiên cao cấp, được kiểm định bởi các tổ chức uy tín quốc tế.'
    },
    {
      icon: Heart,
      title: 'Thiết Kế Tinh Tế',
      description: 'Mỗi món trang sức đều được chế tác thủ công bởi các nghệ nhân lành nghề với sự tỉ mỉ từng chi tiết.'
    },
    {
      icon: Shield,
      title: 'Bảo Hành Trọn Đời',
      description: 'Cam kết bảo hành và chăm sóc sản phẩm trọn đời, đảm bảo vẻ đẹp bền vững theo thời gian.'
    },
    {
      icon: Gift,
      title: 'Dịch Vụ Tận Tâm',
      description: 'Đội ngũ tư vấn chuyên nghiệp luôn sẵn sàng hỗ trợ bạn tìm được món trang sức hoàn hảo.'
    }
  ];

  const team = [
    {
      name: 'Hà Tiến Duy',
      role: 'Founder & Creative Director',
      description: 'Với hơn 20 năm kinh nghiệm trong ngành trang sức, chị Minh Anh là người sáng lập và dẫn dắt tầm nhìn sáng tạo của thương hiệu.'
    },
    {
      name: 'Trần Văn Hùng',
      role: 'Master Craftsman',
      description: 'Nghệ nhân chế tác với 15+ năm kinh nghiệm, chuyên gia về kỹ thuật khảm đá và chế tác kim cương.'
    },
    {
      name: 'Lê Thị Hương',
      role: 'Design Consultant',
      description: 'Chuyên gia tư vấn thiết kế với khả năng hiểu rõ phong cách và nhu cầu của từng khách hàng.'
    }
  ];

  const milestones = [
    { year: '2009', event: 'Thành lập cửa hàng đầu tiên tại Hà Nội' },
    { year: '2012', event: 'Mở rộng showroom và ra mắt bộ sưu tập cao cấp' },
    { year: '2015', event: 'Đạt chứng nhận quốc tế về chất lượng kim cương' },
    { year: '2018', event: 'Khai trương chi nhánh tại TP.HCM' },
    { year: '2020', event: 'Phát triển platform online và dịch vụ tư vấn từ xa' },
    { year: '2024', event: 'Kỷ niệm 15 năm với hơn 50,000 khách hàng tin tưởng' }
  ];

  return (
    <div className="about-page">

      {/* Hero Section */}
      <section className="hero">
        <div className="hero__overlay"></div>
        <div className="container hero__content">
          <h2 className="hero__title">Về Chúng Tôi</h2>
          <p className="hero__subtitle">
            Khám phá câu chuyện đằng sau thương hiệu trang sức cao cấp với hơn 15 năm kinh nghiệm 
            tạo nên những món đồ trang sức đẹp nhất cho những khoảnh khắc đặc biệt trong cuộc đời bạn.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats__grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-card__icon">
                  <stat.icon size={32} />
                </div>
                <div className="stat-card__number">{stat.number}</div>
                <div className="stat-card__label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="tabs-section">
        <div className="container">
          <div className="tabs">
            {[
              { id: 'story', label: 'Câu Chuyện', icon: Heart },
              { id: 'values', label: 'Giá Trị Cốt Lõi', icon: Diamond },
              { id: 'team', label: 'Đội Ngũ', icon: Users },
              { id: 'timeline', label: 'Lịch Sử', icon: Clock }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab ${activeTab === tab.id ? 'tab--active' : ''}`}
              >
                <tab.icon size={20} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="content">
        <div className="container">
          {activeTab === 'story' && (
            <div className="story">
              <div className="story__text">
                <h3 className="story__title">Câu Chuyện Của Chúng Tôi</h3>
                <div className="story__content">
                  <p>
                    Được thành lập vào năm 2009 bởi nghệ nhân Hà Tiến Duy, Luxury Jewelry bắt đầu 
                    từ một xưởng nhỏ với ước mơ tạo ra những món trang sức đẹp nhất cho phụ nữ Việt Nam.
                  </p>
                  <p>
                    Với niềm đam mê cháy bỏng và sự tỉ mỉ trong từng chi tiết, chúng tôi đã không ngừng 
                    học hỏi và phát triển, từ việc chọn lựa nguyên liệu cao cấp nhất đến việc áp dụng 
                    những kỹ thuật chế tác tiên tiến nhất.
                  </p>
                  <p>
                    Ngày nay, sau hơn 15 năm phát triển, chúng tôi tự hào là một trong những thương hiệu 
                    trang sức uy tín hàng đầu, với hơn 50,000 khách hàng tin tưởng trên toàn quốc.
                  </p>
                </div>
              </div>
              <div className="story__image">
                <div className="placeholder-image">
                  <Gem size={64} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'values' && (
            <div className="values">
              <h3 className="values__title">Giá Trị Cốt Lõi</h3>
              <div className="values__grid">
                {values.map((value, index) => (
                  <div key={index} className="value-card">
                    <div className="value-card__icon">
                      <value.icon size={32} />
                    </div>
                    <h4 className="value-card__title">{value.title}</h4>
                    <p className="value-card__description">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="team">
              <h3 className="team__title">Đội Ngũ Chuyên Gia</h3>
              <div className="team__grid">
                {team.map((member, index) => (
                  <div key={index} className="team-card">
                    <div className="team-card__image">
                      <Users size={64} />
                    </div>
                    <div className="team-card__content">
                      <h4 className="team-card__name">{member.name}</h4>
                      <div className="team-card__role">{member.role}</div>
                      <p className="team-card__description">{member.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="timeline">
              <h3 className="timeline__title">Hành Trình Phát Triển</h3>
              <div className="timeline__content">
                <div className="timeline__line"></div>
                <div className="timeline__items">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-item__year">{milestone.year}</div>
                      <div className="timeline-item__event">{milestone.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}