import SearchBar from '@components/Header/SearchBar'
import Markdown from '@shared/Markdown'
import classNames from 'classnames/bind'
import { ReactElement } from 'react'
import styles from './PageHeader.module.css'
import Container from '../atoms/Container'

const cx = classNames.bind(styles)

export default function PageHeader({
  title,
  center,
  description,
  isHome,
  showSearch
}: {
  title: string | ReactElement
  center?: boolean
  description?: string
  isHome?: boolean
  showSearch?: boolean
}): ReactElement {
  const styleClasses = cx({
    header: true,
    center
  })

  return (
    <header className={styleClasses}>
      <div className={isHome && styles.homeTitleContainer}>
        {isHome && (
          <div className={styles.titleContainer}>
            <h1>{title}</h1>
          </div>
        )}
        <Container className={styles.contentContainer}>
          <div className={isHome && styles.content}>
            {!isHome && (
              <div>
                <h1 className={styles.title}>{title}</h1>
              </div>
            )}
            {description && (
              <div>
                <Markdown
                  text={description}
                  className={cx({
                    description: true,
                    smallerDescription: !isHome
                  })}
                />
              </div>
            )}
            {showSearch && (
              <div className={styles.search}>
                <SearchBar placeholder="Search for service offerings" />
              </div>
            )}
          </div>
        </Container>
      </div>
    </header>
  )
}
